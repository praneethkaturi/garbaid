const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')

const router = new express.Router()

router.get('/users', async (req,res) => {
    try{
        const data = await User.find({})
        res.status(200).send(data)
    } catch(error){
        res.status(404).send(error)
    }
})


router.post('/users/signup', async (req, res) => {
    const data = req.body
    const user = new User(data)

    
    try{
        await user.save()
        const token = await user.genAuthToken()
        res.status(200).send({user, token})
    } catch(error){
        res.status(400).send(error)
    }
})

router.get('/users/me', auth, (req, res) => {
    res.status(200).send(req.user)
})

module.exports = router