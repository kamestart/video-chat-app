const localStrat = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const passport = require('passport')


function initializePassportLocal(passport, getUserByUsername, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = getUserByUsername(username)
        if (user == null) {
            return done(null, false, { message: 'Incorrect Username Or Password ' })
        }
    

    try {
        if (await bcrypt.compare(user.password, password)) {
            return done(null, user)
        } else {
            return done(null, false, {message: 'Incorrect Username Or Password '})
        }
    } catch (e) {
         return done(e)
    }
    }
   

  passport.use(new localStrat({ usernameField: 'username' },
  authenticateUser))
  passport.serializeUser((user, done) =>  done(null, user.id))
  passport.deserializeUser((id, done) => {
      done(null, getUserById(id))
  })
}

module.exports = initializePassportLocal