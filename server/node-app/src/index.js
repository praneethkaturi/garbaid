const express = require('express')
const user_router = require('./routers/user')
const complaint_router = require('./routers/complaint')

const app = express()
require('./db/connection.js')

app.use(express.json())
app.use(user_router)
app.use(complaint_router)

app.listen(8000, () => {
    console.log("Server is up on port", 8000)
})
