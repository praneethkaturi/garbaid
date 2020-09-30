const express = require('express')
const User = require('./models/user')
const router = require('./routers/user')

const app = express()
require('./db/connection.js')

app.use(express.json())
app.use(router)

app.listen(8000, () => {
    console.log("Server is up on port", 8000)
})
