import { Router } from "express";
import FileManager from '../manager/file_manager.js'
import io from '../app.js'

const fileManager = new FileManager('products.json')
const router = Router()

router.get('/', async (req, res) => {
    const products = await fileManager.get()
    res.render('index', {products})
})

router.get('/realtimeproducts', async (req, res) => {
    let products = await fileManager.get()
    io.on('connection', socket => {
        console.log('New client connected')

        socket.on('add', async data => {
            const productAdded = await fileManager.add(data)
            products.push(productAdded)
            io.emit('showProducts', products)
        })
        
    })
    res.render('realtimeproducts', {products})

})

router.post('/realtimeproducts', async (req, res) => {
    let products = await fileManager.get()

    const product = req.body
    const productAdded = await fileManager.add(product)
    products.push(productAdded)

    res.json({ status: "success", productAdded })
    io.emit('showProducts', products)    
})

export default router