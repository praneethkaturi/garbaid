const express = require('express')
const axios = require('axios')
const auth = require('../middleware/auth')
const Complaint = require('../models/complaint')

const router = new express.Router()

router.post('/complaints', auth, async (req, res) => {
    const complaint = new Complaint({
        ...req.body,
        owner: req.user._id
    })

    // Hitting the model end point
    try{
        const response = await axios({
            method: 'get',
            url: '/predict',
            baseURL: 'http://flask-app:5000', //'http://flask-app:5000'
            data: {
                ...req.body
            }
        })

        if(parseInt(response.data.class) == 0)
            return res.status(200).send({"class": 0})
        else{
            complaint.rating = response.data.class
            await complaint.save()
            return res.status(200).send({"class": complaint.rating})
        }

    } catch(error){
        res.status(400).send({"error": "Could not connect to flask-app"})
    }
})

router.get('/complaints', auth, async (req, res) => {
    try{
        await req.user.populate({
            path: 'complaints',
        }).execPopulate()

        req.status(200).send(req.user.complaints)
    } catch(error) {
        res.status(400).send()
    }
})

module.exports = router