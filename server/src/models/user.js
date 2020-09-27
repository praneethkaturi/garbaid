const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const config = require('../middleware/config')

const schema = new mongoose.Schema({
  
    'email': {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Please provide a valid email address')
            }
        }        
    },

    'password': {
        type: String,
        required: true,
        trim: true,
        minlength: 7, 
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("Password cannot contain password")
            }
        }        
    },

    'firstname': {
        type: String,
        required: true,
        trim: true,
    },

    'lastname': {
        type: String,
        required: true,
        trim: true
    },

    'tokens': [{
        'token': {
            type: String,
            required: true
        }
    }]
})

// method to generate authentication token, this method
// is for an instance of the user model

schema.methods.genAuthToken = async function(){
    const user = this
    const token = await jwt.sign({_id: user._id}, "userAuth")

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}


// method to verify the credentials provided, this method
// is for the user model and not for an instance of it

schema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

schema.pre('save', async function (next){
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    if(user.isModified('firstname')){
        user.firstname = user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1).toLowerCase()
    }
    if(user.isModified('lastname')){
        user.lastname = user.lastname.charAt(0).toUpperCase() + user.lastname.slice(1).toLowerCase()
    }
    next()
})

const User = mongoose.model('User', schema, 'users')
module.exports = User