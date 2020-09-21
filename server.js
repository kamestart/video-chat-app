if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}
const PORT = process.env.PORT || 3000
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Bu = require('./models/users')
const bcrypt = require('bcrypt')

app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT} `)
})

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }))

mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true })

app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

const db = mongoose.connection

app.post('/login', (req, res) => {

})

app.post('/register', async (req, res) => {
    let i = 1
    try {
        const hashedPwd = await bcrypt.hash(req.body.password, 15)
        const newUserToDB = new Bu ({
            username: req.body.username,
            password: hashedPwd,
            email: req.body.email
        })
        newUserToDB.save()
        res.redirect('/login')
    } catch (e) {
        console.log(e)
    }
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})
