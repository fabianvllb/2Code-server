const Submission = require("../models/submission");
const Problem = require("../models/problem");
const User = require("../models/user");
const { DateTime } = require("luxon");
const RunnerManager = require("../judgingengine/RunnerManager");
const ValidationError = require("../models/validationerror");

// questions
exports.problem_all = async function (req, res, next) {
  const problems = await Problem.getAllProblems({
    active: true,
  });
  res.status(200).send(problems);
};

exports.submission_userAll = async function (req, res) {
  try {
    const submissionList = await Submission.getAllSubmissionsByAuthorId(
      req.params.id
    );
    return res.status(200).json(submissionList);
  } catch (err) {
    return res.status(500).json({ errors: [err] });
  }
};

exports.submission_create = async function (req, res, next) {
  let submission;
  // Search existing submission
  /*try {
    submission = await Submission.find({
      authorId: parseInt(req.body.userid),
      problemId: parseInt(req.body.problemid),
      language: req.body.language,
      status: "initial",
    });
  } catch (err) {
    res.status(422).json({ errors: [err] });
    return next(err);
  }

  if (!submission[0]) {
    // If no submission is found
    // 1. Create new submission
    submission = new Submission(
      parseInt(req.body.userid),
      parseInt(req.body.problemid),
      req.body.solution,
      req.body.language,
      "initial", // not submitted -> just created
      DateTime.now().toISO(),
      null
    );
    // 2. Save new submission
    submission.create();
  }
  res.status(200).send(submission);*/
};

exports.submission_readone = async function (req, res, next) {
  try {
    const user = await User.findUserByEmail(req.body.email);
    if (!user) {
      var error = new ValidationError(
        "body",
        "email",
        req.body.email,
        "USER_NOT_FOUND"
      );
      return res.status(404).json({ errors: [error] });
    }

    const submission = await Submission.findLastSubmissionForProblem(
      req.body.problemId,
      user.id,
      "javascript"
    );
    if (!submission) {
      // no submission for this user and problem is found
      return res
        .status(200)
        .json({ msg: "NO_SUBMISSION_FOUND", submission: submission });
    }
    res.status(200).json({ msg: "RETRIEVED", submission: submission });
  } catch (err) {
    res.status(422).json({ errors: [err] });
    return next(err);
  }
};
/*
exports.submission_update = function(req, res, next) {
};

exports.submission_delete = function(req, res, next) {
};

/**
 * Retrieves all the data needed for compiling and running the submited code (submission).
 * If all the data is correctly retrieved then run function is called.
 * Mandatory params:
 * @param {string} code - The code submited by the user.
 * @param {number} problemId - The problem's id.
 * @param {string} language - The language of the submited code.
 * @param {string} userEmail - The user's email.
 */
exports.submission_run = async function (req, res, next) {
  //console.log("**submission_run starts**");
  try {
    // Search user id:
    const user = await User.findUserByEmail(req.body.email);
    if (!user) {
      // If user doesn't exist
      var error = new ValidationError(
        "body",
        "email",
        req.body.email,
        "USER_NOT_FOUND"
      );
      return res.status(404).json({ errors: [error] });
    }

    // Find submission's problem
    let problem = await Problem.findProblemById(parseInt(req.body.problemId));
    if (!problem) {
      var error = new ValidationError(
        "body",
        "problemId",
        req.body.problemId,
        "PROBLEM_NOT_FOUND"
      );
      return res.status(404).json({ errors: [error] });
    }

    // Search existing submission
    let submission = await Submission.findSubmissionByLanguageAndStatus(
      req.body.problemId,
      req.body.language,
      user.id,
      "pending"
    );
    if (!submission) {
      // If no submission is found
      //console.log("No pending submission was found!");
      // Create new submission
      submission = new Submission(
        req.body.problemId,
        req.body.language,
        user.id,
        req.body.code,
        "pending" // not submitted -> just created
      );
      // Save new submission
      try {
        const rowCount = await submission.insertToDB();
        //console.log("rowCount: ", rowCount);
      } catch (err) {
        return res.status(500).json({ errors: [err] });
      }

      //fetch submission again because we need (and don't currently have) the submission's id.
      submission = await Submission.findSubmissionByLanguageAndStatus(
        req.body.problemId,
        req.body.language,
        user.id,
        "pending"
      );
    } else {
      // If submission exists update solution
      //console.log("A submission was found!");
      submission.solution = req.body.code;
      try {
        await submission.updateToDB();
        //console.log("rowCount: ", rowCount);
      } catch (err) {
        return res.status(500).json({ errors: [err] });
      }
    }

    // Run submission
    run(res, submission, problem);
    //run(req, res, next, submission, problem.uniquename);
  } catch (err) {
    res.status(422).json({ errors: [err] });
  }
};

/**
 * Starts the runtime timer and calls RunnerManager's run function.
 * A callback function is passed to RunnerManager's run function to update the submission in the DDBB.
 * Finally, an API response is sent.
 * @param {} req
 * @param {*} res
 * @param {*} next
 * @param {*} submission
 * @param {*} problemUniquename
 */
//function run(req, res, next, submission, problemUniquename) {
function run(res, submission, problem) {
  //console.log("**Starting run function in submission.js**");

  // 1. Start runtime timer
  let start = DateTime.now();

  // 2. Then, run the solution to get the test result
  RunnerManager.run(submission, problem, async function (status, message) {
    //console.log("--Controller callback--");
    let result = {
      status,
      message,
    };
    console.log("status:", status);
    if (status == "pass" || status == "fail") {
      let end = DateTime.now();
      let ms = end.diff(start, ["seconds", "milliseconds"]);
      console.log("Runtime: ", ms.toObject());

      // 3. Find the submission
      submission.status = status;
      submission.runtime = ms.seconds + ms.milliseconds / 1000;

      // 4. Update the submission
      try {
        await submission.updateToDB();
      } catch (err) {
        return res.status(422).json({ errors: [err] });
      }

      // 5. Send results to client
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  });
}
