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
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from "swagger-ui-express"

const app = express()

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Doc proyecto",
            description: "Doc proyecto"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

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