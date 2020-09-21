if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}
const PORT = process.env.PORT || 3000
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Bu = require('./models/users')
const bcrypt = require('bcrypt')
const initPassport = require('./passport-config')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

initPassport(
    passport,
    username => Bu.find(user => { username: username }),
    id => Bu.find(user => { id: id })

)

app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT} `)
})

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true })

app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
    res.render('register.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

const db = mongoose.connection

app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/', async (req, res) => {
    let i = 1
    try {
        const hashedPwd = await bcrypt.hash(req.body.password, 15)
        const newUserToDB = new Bu ({
            username: req.body.username,
            password: hashedPwd,
            email: req.body.email,
            Userid: i
        })
        i++
        newUserToDB.save()
        res.redirect('/login')
    } catch (e) {
        console.log(e)
    }
})

app.get('/home', (req, res) => {
    res.render('index.ejs')
})
