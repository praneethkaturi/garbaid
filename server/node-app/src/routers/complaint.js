const express = require('express')
const auth = require('../middleware/auth')
const Complaint = require('../models/complaint')

const router = new express.Router()

router.post('/complaints', auth, async (req, res) => {
    const complaint = new Complaint({
        ...req.body,
        owner: req.user._id
    })

    try{
        await complaint.save()
        return res.status(200).send(complaint)
    } catch(error) {
        res.status(400).send(error)
    }

}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
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