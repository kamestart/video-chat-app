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
var MemoryStore = require('memorystore')(session)
const bodyParser = require('body-parser')

const find_user_by_username = (username2) => user = Bu.find( { username: username2 } ).password

const find_user_by_id = id2 => user = Bu.findById(id2)

initPassport(
    
    passport,
    username => find_user_by_username(username),
    id => find_user_by_id 
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

const db = mongoose.connection

app.post('/login', (req, res, next) => {
    console.log(req.url)
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});
app.post('/', async (req, res) => {
    try {
        let i = 1
        await bcrypt.hash(req.body.password, 16)
        .then((hashedPwd) => {
            const user = new Bu({
                username: req.body.username,
                email: req.body.email,
                password: hashedPwd
            });
            user.save()
            .then((response) => {
                res.status(201).json({
                    message: "User successfully created!",
                    result: response
                })
            }).catch(error => {
                res.status(500).json({
                    error: error
                })
            })
        })
    } catch(e) {
        console.log(e)
    }
})

app.get('/home', (req, res) => {
    res.render('index.ejs')
})

app.use(function(err, req, res, next) {
    console.log(err);
})
