const mongoose = require('mongoose')
const Schema = mongoose.Schema
var userSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    id: {
        required: true,
        type: Number
    },
    email: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('user', userSchema)