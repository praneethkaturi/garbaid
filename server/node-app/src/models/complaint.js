const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    'image': {
        type:Buffer,
        required: true
    },

    'owner': {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },

    'rating': {
        type: Number,
        required: true,
        validate(value){
            if(![1,2,3].includes(value)){
                throw new Error('Not a valid class')
            }
        }
    },

    'coordinates': { 
        type: [Number],
        index: '2dsphere',
        required: true
    }

})

const Complaint = mongoose.model('Complaint', schema, 'complaints')
module.exports = Complaint