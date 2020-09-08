const express = require('express')
const User = require('./models/user')
const app = express()
require('./db/connection.js')


app.use(express.json())

app.get('/users', async (req,res) => {
    try{
        const data = await User.find({})
        res.status(200).send(data)
    } catch(error){
        res.status(404).send(error)
    }
})

app.listen(8000, () => {
    console.log("Server is up on port", 8000)
})
