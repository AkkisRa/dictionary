const chalk = require("chalk")
const path = require("path")
const express = require('express')
const cors = require('cors')
const morgan = require("morgan")
const mongoose = require("mongoose")
require("dotenv").config()
const authRouter = require("./routes/auth")
// создание сервера
const server = express()
// библиотека для подключения mongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log(chalk.bold.blueBright("DB IS CONNECTED")))
    .catch(()=> console.log(chalk.bold.red("DB IS NOT CONNECTED")))
// обработка данных в req.body
server.use(express.json())
server.use(cors())
server.use(morgan())
server.use(express.static(path.join(__dirname, "./client/build")))
// роуты которые начинаются с /api/v1 для авторизации
server.use("/api/v1", authRouter)
server.get("*", (req,res) => {
    res.sendFile(path.join(__dirname+"/client/build/index.html"))
})
server.listen(process.env.PORT, () => {
    console.log(chalk.bold.greenBright("SERVER IS STARTED"))
})