const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    let user = User.findUserByEmail(email);
    if (!user) {
      return done(null, false, { message: "No user with that email" });
    }

    if (user.isCorrectPassword(password)) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Password incorrect" });
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, cb) => cb(null, user.id));
  passport.deserializeUser((id, cb) => {
    cb(null, User.findUserById(id));
  });
}

module.exports = initialize;
