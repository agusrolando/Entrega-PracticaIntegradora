import { Router } from "express";
import UserModel from "../dao/mongo/models/user.model.js";
import passport from "passport";

const router = Router()

router.post('/register', passport.authenticate('register', { failureRedirect: '/session/failregister' }), async (req, res) => {
    res.redirect('/session/login')
})
router.get('/failregister', (req, res) => {
    console.log('Fail Strategy');
    res.send({ error: "Failed" })
})


router.get('/register', (req, res) => {
    res.render('session/register')
})

router.post('/register', async(req, res) => {
    const userNew = req.body
    console.log(userNew);

    const user = new UserModel(userNew)
    await user.save()

    res.redirect('/session/login')
})

router.get('/login', (req, res) => {
    res.render('session/login')
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}), async (req, res) => {
    const user = req.user
    if(!user) return res.status(400).json({status: 'error', error: 'Invalid credentials'})

    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
        role: user.role
    }
   
    res.redirect('/products')
})

router.get('/faillogin', (req, res) => {
    res.json({status: 'error', error: 'Failed login'})
})


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.status(500).render('errors/base', {error: err})
        } else res.redirect('/session/login')
    })
})

router.get(
    '/github',
    passport.authenticate('github', {scope: ['user:email']}),
    async(req, res) => {}
)

router.get(
    '/githubcallback',
    passport.authenticate('github', {failureRedirect: '/login'}),
    async(req, res) => {
        console.log("Callback: ", req.user);

        req.session.user = req.user
        console.log("User Session: ", req.session.user);
        res.redirect('/')
    }
)



export default router