import { Router } from "express";
import UserModel from "../dao/mongo/models/user.model.js";

const router = Router()

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

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if(email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        const admin = {
            email,
            password,
            first_name: 'Admin',
            last_name: 'Coder',
            age: 2,
            role: 'admin'
        }
        req.session.user = admin
        res.json({status: 'success', payload: admin})
    } else {
        const user = await UserModel.findOne({email, password}).lean().exec()
        if(!user) {
            return res.status(401).render('errors/base', {
                error: 'Error en email y/o password'
            })
        }
    
        req.session.user = user
        res.redirect('/products')

        }

})


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.status(500).render('errors/base', {error: err})
        } else res.redirect('/session/login')
    })
})



export default router