const db = require("../models/db");
const { validationResult } = require("express-validator");
const ValidationError = require("../models/validationerror");
//const crypto = require("crypto");
const User = require("../models/user");
const { DateTime } = require("luxon");

module.exports.signup = async function (req, res) {
  //SleepUtil.sleep();
  // get the validation result which is defined in router
  /*const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return if validation fails
    return res.status(400).json({ errors: errors.array() });
  }*/

  let user = await User.findUserByEmail(req.body.email);

  if (user) {
    // We verify if an account with this email already exists
    var error = new ValidationError(
      "body",
      "email",
      req.body.email,
      "This email is already in use."
    );
    return res.status(409).json({ errors: [error] });
  } else {
    const arr = req.body.email.split("@");

    // We create a new user account
    let user = new User(
      req.body.email,
      req.body.firstname,
      req.body.lastname,
      arr[0],
      "user"
    );
    // set hash, salt and add time of creation
    //user.setPassword(req.body.password);
    user.timecreated = DateTime.now().toISO();
    //console.log(user);
    let result = await user.insertToDB(); /*(err, row) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ errors: err });
      }
      //let token = user.generateJwt();
      //res.status(201);
      /*res.json({
        token,
      });*/ /*
      res.status(201).json(row);
    });*/
    if (result == 1) {
      res.status(201).send("User created");
      // TODO We proceed to log in
    } else {
      res.status(500).send("Couldn't create user");
    }
  }
};

module.exports.login = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return if validation fails
    return res.status(400).json({ errors: errors.array() });
  }

  let user = await User.findUserByEmail(req.body.email);
  //let user = User.createUserFromObject(data);

  //console.log(user);
  if (!user) {
    // No account with this email has been found
    var error = new ValidationError(
      "body",
      "email",
      req.body.email,
      "This email is not registered."
    );
    return res.status(400).json({ errors: [error] });
  } else {
    // An account with this email has been found
    if (!user.isCorrectPassword(req.body.password)) {
      // Typed password does not match
      var error = new ValidationError(
        "body",
        "password",
        req.body.email,
        "Incorrect password."
      );
      return res.status(400).json({ errors: [error] });
    } else {
      // TODO Password matches, we proceed to log in
      res.status(200).send("Logged in");
    } /*
    /*(err, row) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ errors: err });
      }
      //let token = user.generateJwt();
      //res.status(201);
      /*res.json({
        token,
      });*/
  }
};

module.exports.logout = function (req, res) {
  res.status(200).json({ message: "logged out" });
  /*SleepUtil.sleep();
  console.log(req.cookies);
  res.clearCookie("cookieToken");
  console.log(req.cookies);

  res.status(200).send();*/
};

/*module.exports.autologin = function(req, res) {
  SleepUtil.sleep();
  // check if the user's credentials are saved in a cookie //
  console.log("autologin");
  console.log(req.cookies);
  const token = req.cookies.cookieToken;
  console.log(token);
  if (token) {
    const userDetails = TokenUtil.decodeToken(token);
    console.log(userDetails);
    if (userDetails) {
      User.findOne({ username: userDetails.username }, function(err, user) {
        if (err) {
          res.status(200).send(err);
        }
        // Return if user not found in database
        if (!user) {
          res.status(200).send("User not found");
        }
        // Return if password is wrong
        if (user.hash != userDetails.hash) {
          res.status(200).send("Password is invalid");
        }
        // If credentials are correct, return the user object
        // If a user is found
        if (user) {
          var token = user.generateJwt();
          res.status(200);
          res.json({
            token: token
          });
        }
      });
    } else {
      res.status(200).send();
    }
  } else {
    res.status(401).send();
  }
};*/

/*module.exports.update = function (req, res) {
  SleepUtil.sleep();
  // get the validation result which is defined in router
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return if validation fails
    return res.status(422).json({ errors: errors.array() });
  }

  var upduser = new User({
    _id: req.body._id,
    username: req.body.username,
    email: req.body.email,
    role: req.body.role,
  });

  User.findById(upduser._id, function (err, user) {
    if (!user) {
      var error = new ValidationError(
        "body",
        "username",
        upduser.username,
        "User doesn't exist!"
      );
      res.status(422).json({ errors: [error] });
    } else {
      /*
      // Return if password is wrong
      if (!user.validPassword(upduser.password)) {
        var error = new ValidationError(
          "body",
          "password",
          upduser.password,
          "Password is not match"
        );
        res.status(422).json({ errors: [error] });
      }*/
//
/*User.findOne({ username: upduser.username }, function (err, user2) {
        if (user2 && !user2._id.equals(upduser._id)) {
          var error = new ValidationError(
            "body",
            "username",
            upduser.username,
            "Username is existed!"
          );
          res.status(422).json({ errors: [error] });
        } else {
          User.findOne({ email: upduser.email }, function (err, user3) {
            if (user3 && !user3._id.equals(upduser._id)) {
              var error = new ValidationError(
                "body",
                "email",
                upduser.email,
                "Email is existed!"
              );
              res.status(422).json({ errors: [error] });
            } else {
              //update username and email
              user.username = upduser.username;
              user.email = upduser.email;
              user.role = upduser.role;
              //console.log(user);
              user.save(function (err) {
                var token;
                token = user.generateJwt();
                res.status(200);
                res.cookie("token", token, { maxAge: 60000 }); //expires after 60000 ms = 1 minute
                res.json({
                  token: token,
                });
              });
            }
          });
        }
      });
    }
  });
};*/

/*module.exports.resetpwd = function (req, res) {
  SleepUtil.sleep();
  // get the validation result which is defined in router
  console.log("resetpwd");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return if validation fails
    console.log("haserror");
    console.log(errors);
    return res.status(422).json({ errors: errors.array() });
  }

  const username = req.body.username;
  const password = req.body.password;

  console.log("before passport.authenticate");
  // check with passport
  passport.authenticate("local", function (err, user, info) {
    console.log("after passport.authenticate");
    // If Passport throws/catches an error
    if (err) {
      var error = new ValidationError("body", "password", password, err);
      res.status(422).json({ errors: [error] });
      return;
    }
    // if no user found, meaning validation fails
    if (!user) {
      var error = new ValidationError("body", "username", username, info);
      return res.status(422).json({ errors: [error] });
    }

    // If a user is found
    if (user) {
      // set hash and salt
      user.setPassword(req.body.newpwd);

      console.log(user);
      user.save(function (err) {
        if (err) {
          var error = new ValidationError("body", "password", password, err);
          return res.status(422).json({ errors: [error] });
        }
        var token;
        token = user.generateJwt();
        res.status(200);
        res.cookie("token", token, { maxAge: 60000 }); //expires after 60000 ms = 1 minute
        res.json({
          token: token,
        });
      });
    }
  })(req, res);
};*/
