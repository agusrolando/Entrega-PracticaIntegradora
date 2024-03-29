import {fileURLToPath} from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import passport from 'passport'
import config from './config/config.js'

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

//JWT

export const generateToken = (user, time) => {
    const token = jwt.sign({
        user
    }, config.jwtPrivateKey, {
        expiresIn: time
    })
}

export const validateToken = (token) => {
    return jwt.verify(token, config.jwtPrivateKey, function(err, decoded) {
      return {err, decoded}
    })
  }
  
export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[config.jwtCookieName] : null
}

export const passportCall = (strategy) =>  {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err)
            if (!user) return res.status(401).render("errors/base", {
                error: info.messages ? info.messages : info.toString()
            }), req.logger.error('User No Logeado')
            
            req.user = user
            next()
        })(req, res, next)
    }
}

export const authorization = (role) => {
    return async (req, res, next) => {
        const user = req.user.user;
        if (!user) return res.status(401).send({ error: "Unauthorized" });
        if (user.role != role) return res.status(403).send({ error: 'No Permission' })
        next();
    }
}

export const validateTokenAndGetID = (req, res, next) => {
    const token = req.params.jwt;
    jwt.verify(token, config.private_key, (error, credentials) => {
        if (error) return res.render('session/restore', {
            message: "token expired"
        })
        req.id = credentials.user;
        next();
    })
}

export const passwordFormatIsValid = (password) => {
    const message = {};
    if (password.length < 8) message.large = "Debe tener como minimo 8 caracteres.";
    if (!(/[A-Z]/.test(password))) message.mayus = "Debe contener al menos una mayuscula.";
    if (!(/[0-9]/.test(password))) message.number = "Debe contener algun numero.";

    return message;


}

export default __dirname