const mongoose = require('mongoose')    
var Schema = mongoose.Schema

var userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    id: {
        type: Date,
        required: true,
        default: Date.now().toString()
    }
})


module.exports = mongoose.model('user', userSchema)
