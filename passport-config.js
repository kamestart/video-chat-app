const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const passport = require('passport')

function initialize(passport, getUserByUsername, getUserById) {
  const authenticateUser = async (username, password, done) => {
    const user = getUserByUsername(username)
    if (user == null) {
      return done(null, false, { message: 'Incorrect Username / Password 1' })
    }

    try {
      console.log(password)
      console.log(user.password)
      await bcrypt.compare(password, user.password, function(err, sucess) {
        console.log(password)
        console.log(user.password)
          if(err) {
            throw err
          }
          if (sucess) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Incorrect Username / Password 2' })
          }
      }) 
      
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, authenticateUser))

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize