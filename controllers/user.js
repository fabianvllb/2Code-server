const { validationResult } = require("express-validator");
const ValidationError = require("../models/validationerror");
const User = require("../models/user");

exports.user_readOne = async function (req, res, next) {
  try {
    const user = await User.findUserById(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    res.status(422).json({ errors: [err] });
    return next(err);
  }
};

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

exports.user_updateOne = async function (req, res) {
  /*const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return if validation fails
    return res.status(400).json({ errors: errors.array() });
  }*/

  let user;
  //check if user id exist
  try {
    user = await User.findUserById(req.params.id);
  } catch (err) {
    return res.status(400).json({ errors: [err] });
  }
  if (!user) {
    return res.status(404).json({ status: "USER_NOT_FOUND" });
  }

  if (user.username !== req.body.username) {
    //check if username is not in use by another user
    try {
      let userTemp = await User.findUserByUsername(req.body.username);
      if (userTemp) {
        return res.status(409).json({ status: "USERNAME_TAKEN" });
      }
    } catch (err) {
      return res.status(400).json({ errors: [err] });
    }
  }

  if (user.email !== req.body.email) {
    //check if email is not in use by another user
    try {
      let userTemp = await User.findUserByEmail(req.body.email);
      if (userTemp) {
        return res.status(409).json({ status: "EMAIL_IN_USE" });
      }
    } catch (err) {
      return res.status(400).json({ errors: [err] });
    }
  }

  if (user.role === "admin" && req.body.role === "user") {
    //check there is at least one admin
    try {
      let adminList = await User.findAllFilterByRole("admin");
      if (adminList.length <= 1) {
        return res.status(409).json({ status: "NOT_ALLOWED" });
      }
    } catch (err) {
      return res.status(400).json({ errors: [err] });
    }
  }

  //update user properties
  if (user.email !== req.body.email) {
    user.email = req.body.email;
  }
  user.firstname = req.body.firstname;
  user.lastname = req.body.lastname;
  user.username = req.body.username;
  user.role = req.body.role;

  try {
    const rowCount = await user.updateToDB();
    if (rowCount === 1) {
      return res.status(200).json({ status: "UPDATE" });
    } else {
      return res.status(500).json({ status: "Error updating user" });
    }
  } catch (err) {
    return res.status(400).json({ status: "Error updating user", error: err });
  }
};
