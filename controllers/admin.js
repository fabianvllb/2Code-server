const { validationResult } = require("express-validator");
const ValidationError = require("../models/validationerror");
const User = require("../models/user");

module.exports.admin_signin = async function (req, res) {
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
};

/**
 * Checks if the email corresponds to an admin.
 * @param {string} req.body.email
 * @returns a an object with a boolean representing the result of the query.
 */
module.exports.admin_checkIsAdmin = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let user = await User.findUserByEmail(req.body.email);
  if (!user) {
    var error = new ValidationError(
      "body",
      "email",
      req.body.email,
      "USER_NOT_FOUND"
    );
    return res.status(400).json({ errors: [error] });
  }

  if (user.role === "admin") {
    return res.status(200).json({ isAdmin: true });
  }
  return res.status(200).json({ isAdmin: false });
};
