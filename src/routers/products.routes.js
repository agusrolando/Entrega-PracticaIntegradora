import { Router } from "express";
import FileManager from "../manager/file_manager.js";

const fileManager = new FileManager('products.json')
const router = Router ()

router.get('/', async (req, res) => {
    const products = await fileManager.get()
    res.json({ products })
})

router.post('/', async (req, res) => {
    const product = req.body
    const productAdded = await fileManager.add(product)

    res.json({status: "success", productAdded })
})

router.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const productToUpdate = req.body

    const product = await fileManager.getById(id)
    if(!product) return res.status(404).send('Product not found')

    for (const key of Object.keys(productToUpdate)) {
        product[key] = productToUpdate[key]
    }

    await fileManager.update(id, product)

    res.json({status: "success", product })
})

export default router

