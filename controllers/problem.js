const { validationResult } = require("express-validator");
const ValidationError = require("../models/validationerror");
const Problem = require("../models/problem");
const { DateTime } = require("luxon");
const User = require("../models/user");

exports.question_create = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let authorUser = await User.findUserByEmail(req.body.useremail);

  if (!authorUser) {
    // If author doesn't exist
    console.log("error: author ID not found");
    var error = new ValidationError(
      "body",
      "userid",
      req.body.userid,
      "User not found"
    );
    return res.status(422).json({ errors: [error] });
  }
  // Check if problem's uniquename is not in use
  let uniquename = Problem.stringToUniqueName(req.body.title);
  let newProblem = await Problem.findByUniquename(uniquename);

  if (newProblem) {
    // if a problem with same uniquename exists
    var error = new ValidationError(
      "body",
      "title",
      req.body.title,
      "Uniquename already exists"
    );
    res.status(422).json({ errors: [error] });
  } else {
    newProblem = new Problem(
      req.body.title,
      req.body.description,
      req.body.help,
      req.body.tests,
      authorUser.id,
      req.body.difficulty
    );
    //TODO arreglar estos
    newProblem.jsmain = req.body.jsmain;
    newProblem.cmain = req.body.cmain;
    newProblem.javamain = req.body.javamain;
    newProblem.timecreated = DateTime.now().toISO();
    newProblem.active = req.body.active;

    // probamos a almacenar el nuevo problema en la base de datos
    newProblem.insertToDB();
    res.status(200).json({ status: "CREATE" });
  }
};

exports.question_readone = async function (req, res, next) {
  try {
    const problem = await Problem.findProblemById(req.params.id);
    if (problem) {
      res.status(200).send(problem);
    } else {
      res.status(404).json({ status: "NO_PROBLEM_FOUND" });
    }
  } catch (err) {
    res.status(422).json({ errors: [err] });
    return next(err);
  }
  //console.log("id:", req.params.id, "problem:\n", problem);
};

exports.question_update = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return if validation fails
    return res.status(400).json({ errors: errors.array() });
  }

  let problem;
  try {
    problem = await Problem.findProblemById(req.params.id);
  } catch (err) {
    res.status(422).json({ errors: [err] });
    return next(err);
  }
  if (!problem) {
    return res.status(404).json({ status: "PROBLEM_NOT_FOUND" });
  }

  //check if modifying user id matches author's id
  try {
    const updatingUser = await User.findUserByEmail(req.body.useremail);

    if (updatingUser) {
      if (updatingUser.id != problem.authorid) {
        return res.status(401).json({ status: "USER_NOT_AUTHOR" });
      }
    } else {
      return res.status(401).json({ status: "USER_NOT_FOUND" });
    }
  } catch (err) {
    console.error(err);
  }
  if (problem.title != req.body.title) {
    let uniquename = Problem.stringToUniqueName(req.body.title);
    let otherProblem = await Problem.findByUniquename(uniquename);

    if (otherProblem) {
      return res.status(409).json({ status: "TITLE_IN_USE" });
    } else {
      problem.title = req.body.title;
      problem.uniquename = uniquename;
    }
  }
  problem.description = req.body.description;
  problem.help = req.body.help;
  problem.tests = req.body.tests;
  problem.difficulty = req.body.difficulty;
  problem.jsmain = req.body.jsmain;
  problem.cmain = req.body.cmain;
  problem.javamain = req.body.javamain;
  problem.active = req.body.active;

  await problem.updateToDB();
  res.status(200).json({ status: "UPDATE" });
};

/*exports.question_delete = function (req, res, next) {
  //SleepUtil.sleep();
  Question.findByIdAndRemove(req.params.id, function (err, question) {
    if (err) return next(err);
    res.status(200).send(question);
  });
};*/

exports.question_all = async function (req, res) {
  if (req.query?.property) {
    try {
      const problemsArray = await Problem.getAllActiveQuestionsMinimalOrderBy(
        req.query.authorid,
        req.query.property
      );
      return res.status(200).send(problemsArray);
    } catch (err) {
      res.status(422).json({ errors: [error] });
      return next(err);
    }
  } else {
    try {
      const problemsArray = await Problem.getAllActiveQuestionsMinimal();
      return res.status(200).send(problemsArray);
    } catch (err) {
      return res.status(422).json({ errors: [error] });
    }
  }
};
