const { validationResult } = require("express-validator");
const ValidationError = require("../models/validationerror");
const Problem = require("../models/problem");
const { DateTime } = require("luxon");
const User = require("../models/user");
//const { PrismaClient, Prisma } = require("@prisma/client");

//const prisma = new PrismaClient();

exports.question_create = async function (req, res, next) {
  let authorUser = await User.findUserById(req.body.userid);

  //console.log(authorUser);

  // If author doesn't exist
  if (!authorUser) {
    console.log("error: author ID not found");
    var error = new ValidationError(
      "body",
      "userid",
      req.body.userid,
      "User not found"
    );
    return res.status(400).json({ errors: [error] });
  }
  //console.log("author id: ", authorUser.id);
  // Check if problem's uniquename is not in use
  let uniquename = Problem.stringToUniqueName(req.body.title);
  let newProblem = await Problem.findByUniquename(uniquename);

  //console.log(newProblem);

  if (newProblem) {
    var error = new ValidationError(
      "body",
      "title",
      req.body.title,
      "Uniquename ya existe"
    );
    res.status(422).json({ errors: [error] });
  } else {
    newProblem = new Problem(
      req.body.title,
      req.body.description,
      authorUser.id,
      req.body.difficulty
    );
    newProblem.jsmain = req.body.jsmain;
    newProblem.cmain = req.body.cmain;
    newProblem.javamain = req.body.javamain;
    newProblem.timecreated = DateTime.now().toISO();
    newProblem.active = true;

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
      res.status(404).json({ errors: ["No user for given id"] });
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
  if (problem) {
    if (problem.title != req.body.title) {
      let uniquename = Problem.stringToUniqueName(req.body.title);
      let otherProblem = await Problem.findByUniquename(uniquename);

      if (otherProblem) {
        var error = new ValidationError(
          "body",
          "title",
          req.body.title,
          "Uniquename is already in use"
        );
        return res.status(409).json({ errors: [error] });
      } else {
        problem.title = req.body.title;
        problem.uniquename = uniquename;
      }
    }
    problem.description = req.body.description;
    problem.difficulty = req.body.difficulty;
    problem.jsmain = req.body.jsmain;
    problem.cmain = req.body.cmain;
    problem.javamain = req.body.javamain;
    problem.active = req.body.active;

    problem.updateToDB();
    return res.status(200).send(problem);
  }
  return res.status(404).send("No problem found");
};

/*exports.question_delete = function (req, res, next) {
  //SleepUtil.sleep();
  Question.findByIdAndRemove(req.params.id, function (err, question) {
    if (err) return next(err);
    res.status(200).send(question);
  });
};*/

exports.question_all = async function (req, res, next) {
  try {
    const problemsArray = await Problem.getAllActiveQuestionsMinimal();
    res.status(200).send(problemsArray);
  } catch (err) {
    res.status(422).json({ errors: [error] });
    return next(err);
  }
};
