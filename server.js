if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}
const PORT = process.env.PORT || 3000
const express = require('express')
const app = express()
const mongoose = require('mongoose')    

var user_in_db = require('./models/user')
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
    username => {
        var useri
        return useri = user_in_db.findOne( { username: username })
        .exec()
        .then(final_user => {
            return finalUser = final_user
            console.log(final_user)
        })
        .catch(err => console.log(err))
        
    },  
    id => {
        var userReturnedById
        return userReturnedById = user_in_db.findById(id)
        .exec()
        .then(final_user => {
            return finalUser = final_user
        })
        .catch(err => console.log(err))
    }

)
app.set('trust proxy', 1);

app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT} `)
})

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))
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

app.use(session({ secret: process.env.SESSION_SECRET }));
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
        var salt = await bcrypt.genSalt(16)
        const hashedPwd = await bcrypt.hash(req.body.password, salt)
            const newUser = new user_in_db({
                username: req.body.username,
                email: req.body.email,
                password: hashedPwd,
                id: i
            })
            i = i + 1
            newUser.save().then(result => {
                console.log('erfcfcdwwq3e')
            })
            res.redirect('/login') 
    } catch(e) {
        console.log(e)
    }
})

app.get('/home', (req, res) => {
    res.render('index.ejs', { name: req.user.username  })
})

