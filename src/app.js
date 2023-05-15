import express from "express";
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import __dirname from "./utils.js"
// import mongoose from "mongoose";
import session from "express-session";
import run from "./run.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser"
import { addLogger } from "./errors/logger.js";


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(addLogger)
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")


app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())



const socketServer = new Server(httpServer)
httpServer.on("error", () => console.log("ERROR"))
const httpServer = app.listen(8080, () => console.log("Listening..."))


run(socketServer, app)