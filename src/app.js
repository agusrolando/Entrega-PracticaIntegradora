import express from 'express'
import productRouter from './routers/products.routes.js'
import cartRouter from './routers/cart.router.js'
import viewRouter from './routers/view.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
const app = express()

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json())
// app.use(express.urlencoded({extended: true}))

app.use('static', express.static('public'))
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.use('/', viewRouter)


const server = app.listen(8080)
server.on('error', () => console.log('ERROR'))

const io = new Server(server)

export default io