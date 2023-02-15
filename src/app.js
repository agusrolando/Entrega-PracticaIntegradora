import express from "express";
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import __dirname from "./utils.js"
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import run from "./run.js";

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

const MongoUri = "mongodb+srv://Rolo:tPYxrdW9ginqAoa2@cluster0.pycm23b.mongodb.net/?retryWrites=true&w=majority"
const MongoDbName = "myFirstDatabase"

app.use(session({
    store: MongoStore.create({
        mongoUrl: MongoUri,
        dbName: MongoDbName
    }),
    secret: "mysecret",
    resave: true,
    saveUninitialized: true
}))

mongoose.connect(MongoUri, {
    dbName: MongoDbName,
}, (error) => {
    if(error){
        console.log("DB No conected...")
        return
    }
    const httpServer = app.listen(8080, () => console.log("Listening..."))
    const socketServer = new Server(httpServer)
    httpServer.on("error", () => console.log("ERROR"))
    run(socketServer, app)
})

