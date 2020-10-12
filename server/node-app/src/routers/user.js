const express = require('express')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const User = require('../models/user')

const router = new express.Router()

router.get('/users/me', auth, (req, res) => {
    res.status(200).send(req.user)
})

router.post('/users/signup', async (req, res) => {
    const data = req.body
    const user = new User(data)

    
    try{
        await user.save()
        const token = await user.genAuthToken()
        res.status(200).send({user, token})
    } catch(error){
        res.status(400).send()
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.genAuthToken()

        res.status(200).send({user, token})
    }

    catch(error){
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })

        await req.user.save()
    }

    catch (error){
        res.status(400).send()
    }

    res.status(200).send()
})

router.patch('/users/update', auth, async (req, res) => {
    const allowed_updates = ['email', 'password']
    const keys = Object.keys(req.body)

    const is_allowed = keys.every((key) => {
        return allowed_updates.includes(key)
    })

    if(!is_allowed){
        return res.status(400).send()
    }

    try{
        req.user = await User.findOneAndUpdate({_id: req.user._id}, req.body, {
            new:true
        })
        await req.user.save()

        res.status(200).send(req.user)
        
    } catch(e){
        return res.status(400).send({"error": "Could not update, try again later"})
    }
})



module.exports = router