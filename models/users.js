const mongoose = require('mongoose')    

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    id: {
        type: Date,
        required: true,
        default: Date.now().toString()
    },
    dateJoined: {
        type: Date,
        required: true,
        default: Date.now()
    }
})


module.exports = mongoose.model('user', userSchema)
