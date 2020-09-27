const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../middleware/config')

const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, 'userAuth')
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

    if(!user){
        return res.status(401).send()
    }

    req.user = user
    req.token = token

    next()
}

module.exports = auth
