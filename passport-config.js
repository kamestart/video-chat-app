const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const passport = require('passport')


function initialize(passport, getUserByUsername, getUserById, getUserPassword) {
  const authenticateUser = async (username, password, done) => {
    const user =await getUserByUsername(username)
    const userPwd = await getUserPassword(username)
    console.log(userPwd)
    console.log(user)
    if (user == null) {
      return done(null, false, { message: 'Incorrect Username / Password 1' })
    }
    if (userPwd == null) {
      return done(null, false, { message: 'Incorrect Username / Password 1' })
    }
    
    try {
      if (await bcrypt.compareSync(password, userPwd)) {
        return done(null, user)
      } else {
          return done(null, false, { message: 'Incorrect Username / Password 2' })
        } 
      
      
    } catch (e) {
      console.log(e)
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
