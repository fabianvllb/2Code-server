const db = require("../models/db");
const { validationResult } = require("express-validator");
const ValidationError = require("../models/validationerror");
const User = require("../models/user");

module.exports.signin = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return if validation fails
    return res.status(400).json({ errors: errors.array() });
  }

  let user = await User.findUserByEmail(req.body.email);
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

  if (user.role != "admin") {
    // user is not admin
    var error = new ValidationError(
      "body",
      "email",
      req.body.email,
      "Usuario no es admin"
    );
    return res.status(400).json({ errors: [error] });
  }

  // An admin account with this email has been found then:
  res.status(200).json({ status: "SIGNED" });
  /*if (!user.isCorrectPassword(req.body.password)) {
    // Typed password does not match
    var error = new ValidationError(
      "body",
      "password",
      req.body.password,
      "Constraseña incorrecta"
    );
    return res.status(400).json({ errors: [error] });
  } else {
    res.status(200).json({ status: "SIGNED" });
  }*/
};
