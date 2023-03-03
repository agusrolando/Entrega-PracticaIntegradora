import passport from "passport";
import local from "passport-local"
import UserModel from "../dao/mongo/models/user.model.js";
import { createHash, isValidPassword, generateToken, extractCookie} from '../utils.js'
import GithubStrategy from 'passport-github2'
import passport_jwt from "passport-jwt"
import { jwtPrivateKey } from "./credentials.js"; 
import cartModel from "../dao/mongo/models/cart.model.js"

const LocalStrategy = local.Strategy
const JWTStrategy = passport_jwt.Strategy
const ExtractJWT = passport_jwt.ExtractJwt

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
    
        const {first_name, last_name, email, age } = req.body
        try {
            const user = await UserModel.findOne({email: username})
            if(user) {
                console.log("User already exits");
                return done(null, false)
            }
    
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: await cartModel.create({}),
                role: 'user'
            }
            const result = await UserModel.create(newUser)
            console.log(newUser)
            
            return done(null, result)
        } catch (error) {
            return done("[LOCAL] Error al obtener user " + error)
        }
    
    }))

    
    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
        try {
            if(username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                const admin = {
                    _id: '63e4ee6a795025c3ccb9b29a',
                    email: username,
                    password,
                    first_name: 'Admin',
                    last_name: 'Coder',
                    age: 100,
                    role: 'admin'
                }
                return done(null, admin)
            }
    
            const user = await UserModel.findOne({email: username})
            if(!user) {
                console.log("User doesn't exist")
                return done(null, false)
            }
            if(!isValidPassword(user, password)) return done(null, false)
            const token = generateToken(user)
            user.token = token
            return done(null, user)
        } catch(error) {
            return done(error)
        }
    }))


    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.932009372a39a10b',
        clientSecret: '58d69c6574f04712b65c1b67495259e10d4b2d39',
        callbackURL: 'http://127.0.0.1:8080/session/githubcallback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await UserModel.findOne({email: profile._json.email})

            if(!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: profile._json.age,
                    email: profile._json.email,
                    password: '',
                    cart: await cartModel.create({}),
                    role: "user"
                }
                
                const result = await UserModel.create(newUser)
                return done(null, result)
            }
            done(null, user)
        } catch(error) {
            return done(error)
        }
    }))

}

passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
    secretOrKey: jwtPrivateKey
}, async(jwt_payload, done) => {
    done(null, jwt_payload)
}))

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id)
    done(null, user)
})

export default initializePassport