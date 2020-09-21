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
        required: false
    },
    dateJoinedID: {
        type: Date,
        required: true,
        default: Date.now().toString()
    },
    dateJoined: {
        type: Date,
        required: true,
        default: Date.now()
    },
    
})


module.exports = mongoose.model('user', userSchema)
