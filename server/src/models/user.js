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
    }
})

schema.pre('save', async function (next){
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', schema, 'users')
module.exports = User