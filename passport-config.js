// const localStrat = require('passport-local').Strategy
//const bcrypt = require('bcrypt')


// async function initializePassportLocal(passport, getUserByEmail) {
 //   const authenticateUser = (username, password, done) => {
   //     const user = getUserByUsername(username)
     //   if (user == null) {
       //     return done(null, false, 'Incorrect Username Or Password ')
        //}
//    }

  //  try {
    //    if (await bcrypt.compare(password, user.password)) {
      //      return done(null, user)
        // } else {
           // return done(null, false, 'Incorrect Username Or Password ')
        // }
    // } catch (e) {
       //  return done(e)
     //}
    //passport.use(new localStrat({ usernameField: 'username' }),
    //authenticateUser)
    //passport.serializeUser((user, done) => {  })
    //passport.deserializeUser((id, done) => {  })
//}

// module.exports = initializePassportLocal