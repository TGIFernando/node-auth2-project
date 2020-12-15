const express = require("express")
const helmet = require("helmet")
const cors = require("cors")

const AuthRouter = require("./auth/auth-router")

const server = express()

server.use(helmet())
server.use(cors())
server.use(express.json())

server.use("/api", AuthRouter)

server.get("/", (_, res) => {
    res.json({api: "online"})
})

module.exports = server