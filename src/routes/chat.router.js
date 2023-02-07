import { Router } from "express"

const router = Router()

router.get("/", (req, res) => {
    res.render("chat", {})
})

router.get("/", async (req, res) => {
    try {
        const message = await messagesModel.find()
        res.send({
            result: "success",
            payload: message
        })
    } catch (error) {
        console.log(error)
        res.send({
            result: "error",
            error
        })
    }
})

router.post("/", async (req, res) => {
    const result = await messagesModel.create(req.body)
    res.send({
        result: "success",
        payload: result
    })
})

router.put("/:mid", async (req, res) => {
    const mid = req.params.mid
    const messageToReplace = req.body
    const result = await messagesModel.updateOne({
        _id: mid
    }, messageToReplace)
    res.send({
        result: "success",
        payload: result
    })
})

router.delete("/:mid", async (req, res) => {
    const mid = req.params.mid
    const result = await messagesModel.deleteOne({
        _id: mid
    })
    res.send({
        result: "success",
        payload: result
    })
})

export default router