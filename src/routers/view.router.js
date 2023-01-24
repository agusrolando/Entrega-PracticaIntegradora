import { Router } from "express";
import FileManager from '../manager/file_manager.js'

const fileManager = new FileManager('products.json')
const router = Router()
const products = await fileManager.get()

router.get('/', async (req, res) => {
    res.render('index', {products})
})

router.get('/realtimeproducts', (req, res) => {
   res.render('realTimeProducts', {products})
})

export default router