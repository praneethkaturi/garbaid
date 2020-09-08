const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const schema = new mongoose.Schema({
    'username':{
        type: String,
        required: true,
        trim: true
    },

    'email': {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
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

    'firstName': {
        type: String,
        required: true,
        trim: true,
    },

    'lastName': {
        type: String,
        required: true,
        trim: true
    }
})

schema.pre('save', async function (next){
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    if(user.isModified('firstName')){
        user.firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()
    }
    if(user.isModified('lastName')){
        user.lastName = user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1).toLowerCase()
    }
    next()
})

const User = mongoose.model('User', schema, 'users')
module.exports = User