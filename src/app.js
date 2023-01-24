import express from 'express'
import productRouter from './routers/products.routes.js'
import cartRouter from './routers/cart.router.js'
import viewRouter from './routers/view.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import FileManager from './manager/file_manager.js'

const fileManager = new FileManager('products.json')
const app = express()

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json())

app.use(express.static(__dirname+'/public'))
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.use('/', viewRouter)


const server = app.listen(8080)
server.on('error', () => console.log('ERROR'))

const io = new Server(server)

io.on('connection', async socket =>{
    console.log("Connected")
    socket.emit("showProducts", await fileManager.get());

    socket.on("addProduct", async data => {
        await fileManager.add(data)
        io.sockets.emit("showProducts", await fileManager.get());
    })
})
