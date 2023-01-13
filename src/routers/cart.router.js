import { Router } from "express";
import CartManager from "../manager/cart_manager.js";

const cartManager = new CartManager('cart.json')
const router = Router ()

router.get('/', async (req, res) => {
    const carts = await cartManager.get()
    res.json({ carts })
})

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const cart = await cartManager.getById(id)
    res.json({ cart })
})

router.post('/', async (req, res) => {
    const newCart = await cartManager.create()

    res.json({status: "success", newCart })
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cartID = parseInt(req.params.cid)
    const productID = parseInt(req.params.pid)

    const cart = await cartManager.addProduct(cartID, productID)

    res.json({status: "success", cart })
})

export default router

