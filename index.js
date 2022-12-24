"use strict"

const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

const JwtMiddleware = require("./src/middlewares/JwtMiddleware.js");

const HomeRoutes = require('./src/routes/HomeRoutes')
const UserRoutes = require('./src/routes/UserRoutes')
const AuthRoutes = require('./src/routes/AuthRoutes')
const TransactionRoutes = require('./src/routes/TransactionRoutes')
const PaymentRoutes = require('./src/routes/PaymentRoutes')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
   extended: true
}))

app.use(cors({
   origin: "*",
   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
   allowedHeaders: "Content-Type, Authorization, X-Requested-With, Accept"
}))

// Routes
app.use("/", HomeRoutes)
app.use("/api/auth", AuthRoutes)
app.use("/api/user", JwtMiddleware, UserRoutes)
app.use("/api/transaction", JwtMiddleware, TransactionRoutes)
app.use("/api/payment", JwtMiddleware, PaymentRoutes)

app.listen(port, () => {
   console.log(`Listening at http://localhost:${port}`)
})
