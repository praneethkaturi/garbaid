const express = require('express')
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

router.get('/users/:id', async (req, res) => {
    const user = await User.findOne({'email' : req.params.id})

    if(!user){
        res.status(400).send({'Error' : 'Cannot find user'})
    }
    
    res.status(200).send(user)
})

router.post('/users/signup', async (req, res) => {
    const data = req.body
    const user = new User(data)

    const token = await user.genAuthToken()

    try{
        await user.save()
        res.status(200).send({user, token})
    } catch(error){
        res.status(400).send(error)
    }
})

module.exports = router