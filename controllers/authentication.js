const { validationResult } = require("express-validator");
const ValidationError = require("../models/validationerror");
//const crypto = require("crypto");
const User = require("../models/user");
const { DateTime } = require("luxon");

/**
 * Creates a new user account by adding a user entry on the user table in the DDBB.
 * @param {string} req.body.email
 * @param {string} req.body.firstname
 * @param {string} req.body.lastname
 * @param {string} req.body.password
 * @returns {object} object which contains either a string with status of query or error object.
 */
module.exports.signup = async function (req, res) {
  let user;
  /*const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return if validation fails
    return res.status(400).json({ errors: errors.array() });
  }*/
  // Check if email is already in use by another user.
  user = await User.findUserByEmail(req.body.email);
  if (user) {
    // We verify if an account with this email already exists
    return res.status(200).json({ status: "EMAIL_IN_USE" });
  }

  // Retrieves the username part of the email address
  const arr = req.body.email.split("@");

  // We create a new user account
  user = new User(
    req.body.email,
    req.body.firstname,
    req.body.lastname,
    arr[0],
    "user"
  );
  user.timecreated = DateTime.now().toISO();

  const rowsCreated = await user.insertToDB();
  if (rowsCreated === 0) {
    return res.status(409).json({ errors: ["signup: Cound't create user"] });
  }
  res.status(201).json({ status: "CREATE" });
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
      "Este email no está registrado"
    );
    return res.status(400).json({ errors: [error] });
  }
  // An account with this email has been found
  if (user.role != "user") {
    // user is admin
    var error = new ValidationError(
      "body",
      "email",
      req.body.email,
      "Este email no está registrado"
    );
    return res.status(400).json({ errors: [error] });
  }
  // An account with this email has been found then:
  res.status(200).json({ status: "SIGNED" });
};

module.exports.logout = function (req, res) {
  res.status(200).json({ message: "logged out" });
};
