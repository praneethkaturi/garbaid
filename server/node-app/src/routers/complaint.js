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
        //console.log(complaint.image);
        const response = await axios({
            method: 'get',
            url: '/predict',
            baseURL: 'http://localhost:5000',
            data: {
                ...req.body
            }
        })
        res.status(200).send(response.data)

    } catch(error){
        res.status(400).send({"error": "Could not connect to flask-app"})
    }

    // try{
    //     await complaint.save()
    //     return res.status(200).send(complaint)
    // } catch(error) {
    //     res.status(400).send(error)
    // }

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