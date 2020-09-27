if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}
const PORT = process.env.PORT || 3000
const express = require('express')
const app = express()
const mongoose = require('mongoose')    

var userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true,
        }
    }
)

var user = mongoose.model('user', userSchema)
const bcrypt = require('bcrypt')
const initPassport = require('./passport-config')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
var MemoryStore = require('memorystore')(session)
const bodyParser = require('body-parser')

const find_user_by_username = (username2) => {
    var userGuy = user.find( { username: username2 }, function(err, user){
        var userReturned
        if (user) {
            userReturned = user
            userReturned
        } else if (err)  {
            console.log(err)
            throw err
        } else {
            console.log("No User with that username/password")
        }

    return userGuy    
    })
}


const find_user_password = (username3) => {
    var userPASSWORD = user.find({ username: username3 }, function(err, password){
        var userPassword
        if(err == null) {
            userPassword = password
        } else if (err) {
            console.log(err)
            throw err
        } else {
            console.log("No User with that username/password")
            userReturned = null
        }

        return userPASSWORD

    }).select('password')
}
 

const find_user_by_id = id2 => userReturnedById = user.findById(id2)

initPassport(
    passport,
    username => find_user_by_username(username),
    id => find_user_by_id(id),
    username3 => find_user_password(username3)
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
});
app.post('/', async (req, res) => {
    try {
        await bcrypt.hash(req.body.password, 16)
        .then((hashedPwd) => {
            var i = 1
            const newUser = new user({
                username: req.body.username,
                email: req.body.email,
                password: hashedPwd,
                id: i
            })
            i++
            newUser.save()
            .then((response) => {
                res.redirect('/login')
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

