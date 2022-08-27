const { validationResult } = require("express-validator");
const ValidationError = require("../models/validationerror");
const User = require("../models/user");

exports.user_readoneFromEmail = async function (req, res, next) {
  try {
    const user = await User.findUserByEmail(req.body.email);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ errors: ["No user for given email"] });
    }
  } catch (err) {
    res.status(422).json({ errors: [err] });
    return next(err);
  }
};

exports.user_readAllProblems = async function (req, res, next) {
  try {
    const user = await User.findUserById(req.body.id);
    if (user != null) {
      const problems = await User.getAllUserProblems(user.id);
      if (problems) {
        res.status(200).send(problems);
      } else {
        res
          .status(404)
          .json({ errors: ["Error fetching problems for given user"] });
      }
    } else {
      res.status(404).json({ errors: ["No user for given email"] });
    }
  } catch (err) {
    res.status(422).json({ errors: [err] });
    return next(err);
  }
};

exports.user_readAllUsers = async function (req, res) {
  try {
    let userList = await User.getAllUsers();
    res.status(200).json(userList);
  } catch (err) {
    return res.status(500).json({ errors: [err] });
  }
};
