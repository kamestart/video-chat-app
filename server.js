if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}
const PORT = process.env.PORT || 3000
const express = require('express')
const app = express()
const mongoose = require('mongoose')    

var user_in_db = require('./models/users')
const bcrypt = require('bcrypt')
const initPassport = require('./passport-config')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
var MemoryStore = require('memorystore')(session)
const bodyParser = require('body-parser')
var i = 1

initPassport(
    passport,
    username => user_to_login = user_in_db.findOne( { username: username }),
    id => userReturnedById = user_in_db.findById(id),
    username => user_password = user_in_db.findOne({ username: username }, 'password')
)
app.set('trust proxy', 1);

app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT} `)
})

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    cookie: {
            secure: true,
            maxAge: 86400000
           },
    store: new MemoryStore(),
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


app.post('/login', (req, res, next) => {
    console.log(req.url)
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
})

app.post('/', async (req, res) => {
    try {
        const hashedPwd = await bcrypt.hash(req.body.password, 16)
            const newUser = new user_in_db({
                username: req.body.username,
                email: req.body.email,
                password: hashedPwd,
                id: i
            })
            i = i + 1
            newUser.save()
            res.redirect('/login') 
    } catch(e) {
        console.log(e)
    }
})

app.get('/home', (req, res) => {
    res.render('index.ejs')
})

