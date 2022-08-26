const Submission = require("../models/submission");
const Problem = require("../models/problem");
const User = require("../models/user");
const { DateTime } = require("luxon");
const RunnerManager = require("../judgingengine/RunnerManager");
const ValidationError = require("../models/validationerror");
/*const Question = require("../models/question");
const ValidationError = require("../models/validationerror");
const ErrorUtil = require("../utils/").ErrorUtil;
const SleepUtil = require("../utils/").SleepUtil;*/

// questions
exports.problem_all = async function (req, res, next) {
  const problems = await Problem.getAllProblems({
    active: true,
  });
  res.status(200).send(problems);
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

  /*Submission.findById(parseInt(req.params.id), function (err, submission) {
    if (err) {
      return next(err);
    }
    res.status(200).send(submission);
  });*/
};
/*
exports.submission_update = function(req, res, next) {
  SleepUtil.sleep();
  var upd = {
    username: req.body.username,
    questionname: req.body.questionname,
    language: req.body.language,
    solution: req.body.solution,
    status: "initial",
    timeupdated: moment(new Date(Date.now()))
  };

  Submission.findOne({ _id: req.params.id }, function(err, submission) {
    if (err) {
      return next(err);
    }
    if (submission && submission.status != "initial") {
      var error = ErrorUtil.buildError(
        "Can't update solution which has already been submitted!"
      );
      return res.status(422).json({ errors: [error] });
    } else {
      Submission.findByIdAndUpdate(
        req.params.id,
        { $set: upd },
        { new: true },
        function(err, submission) {
          if (err) return next(err);
          res.status(200).send(submission);
        }
      );
    }
  });
};

exports.submission_findByKeys = function(req, res, next) {
  SleepUtil.sleep();
  console.log(req.params.keys);
  var strKeys = req.params.keys;
  if (!strKeys) {
    var error = ErrorUtil.buildError("Invalid parameter: keys");
    return res.status(422).json({ errors: [error] });
  }
  var keys = strKeys.split(",");
  if (keys.length != 3) {
    var error = ErrorUtil.buildError("Invalid parameter: keys");
    return res.status(422).json({ errors: [error] });
  }

  // find the latest one with the given user name, quenstion name and language
  Submission.findOne(
    { username: keys[0], questionname: keys[1], language: keys[2] },
    null,
    { sort: { timecreated: -1 } },
    function(err, submission) {
      if (err) {
        return next(err);
      }
      if (submission) {
        console.log(submission);
        res.status(200).send(submission);
      } else {
        res.status(200).send();
      }
    }
  );
};

exports.submission_delete = function(req, res, next) {
  SleepUtil.sleep();
  Submission.findByIdAndRemove(req.params.id, function(err, submission) {
    if (err) return next(err);
    res.status(200).send(submission);
  });
};

exports.submission_all = function(req, res, next) {
  SleepUtil.sleep();
  console.log(req.params.names);
  var strname = req.params.names;
  if (!strname) {
    var error = ErrorUtil.buildError("Invalid parameter: names");
    return res.status(422).json({ errors: [error] });
  }
  var names = strname.split(",");
  if (names.length != 2) {
    var error = ErrorUtil.buildError("Invalid parameter: names");
    return res.status(422).json({ errors: [error] });
  }

  Submission.find({
    username: names[0],
    questionname: names[1],
    status: { $ne: "initial" }
  })
    .sort({ timesubmitted: "desc" })
    .exec(function(err, submissions) {
      if (err) return next(err);
      res.status(200).send(submissions);
    });
};*/

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
} /*

/*exports.question_findByKeys = function(req, res, next) {
  var strKeys = req.params.keys;
  if (!strKeys) {
    var error = ErrorUtil.buildError("Invalid parameter: keys");
    return res.status(422).json({ errors: [error] });
  }
  var keys = strKeys.split(",");
  if (keys.length != 2) {
    var error = ErrorUtil.buildError("Invalid parameter: keys");
    return res.status(422).json({ errors: [error] });
  }

  Question.findOne({ uniquename: keys[0] }, function(err, question) {
    if (err) {
      return next(err);
    }
    if (!question) {
      var error = new ValidationError(
        "body",
        "uniquename",
        req.params.uniquename,
        "No question is found!"
      );
      res.status(422).json({ errors: [error] });
    }

    //console.log(submissions);
    var retq = {
      _id: question._id,
      sequence: question.sequence,
      title: question.title,
      uniquename: question.uniquename,
      description: question.description,
      mainfunction: question.mainfunction,
      jsmain: question.jsmain,
      pythonmain: question.pythonmain,
      solution: question.solution,
      difficulty: question.difficulty,
      frequency: question.frequency,
      rating: question.rating,
      hints: question.hints,
      id1: "",
      id2: "",
      id3: ""
    };

    // get submissions if exist
    if (keys[1]) {
      console.log(keys[1]);
      // find the latest one with the given user name, quenstion name and language
      */ /*
      db.submissions.aggregate([
          { $sort: { "timecreated": -1 } },
          { $group: { _id: "$language", latest: { $first: "$$ROOT" } }},
          { $project : {_id : "$latest._id", username : "$latest.username", questionname : "$latest.questionname", solution : "$latest.solution", language : "$latest.language", status : "$latest.status", timeupdated : "$latest.timeupdated", timesubmitted : "$latest.timesubmitted", runtime : "$latest.runtime" }},
          { $sort: { "language": 1 } }
      ]).pretty()
      */ /*
      Submission.aggregate(
        [
          { $match: { questionname: keys[0], username: keys[1] } },
          { $sort: { timeupdated: -1 } },
          { $group: { _id: "$language", latest: { $first: "$$ROOT" } } },
          {
            $project: {
              _id: "$latest._id",
              username: "$latest.username",
              questionname: "$latest.questionname",
              solution: "$latest.solution",
              language: "$latest.language",
              status: "$latest.status",
              timeupdated: "$latest.timeupdated",
              timesubmitted: "$latest.timesubmitted",
              runtime: "$latest.runtime"
            }
          },
          { $sort: { language: 1 } }
        ],
        function(err, submissions) {
          if (err) {
            return next(err);
          }
          if (submissions) {
            // replace the solution in question with user's submission
            for (var i = 0; i < submissions.length; i++) {
              const submission = submissions[i];
              if (submission.language == "java") {
                retq.mainfunction = submission.solution;
                if (submission.status == "initial") {
                  retq.id1 = submission._id;
                }
              } else if (submission.language == "javascript") {
                retq.jsmain = submission.solution;
                if (submission.status == "initial") {
                  retq.id2 = submission._id;
                }
              } else if (submission.language == "python") {
                retq.pythonmain = submission.solution;
                if (submission.status == "initial") {
                  retq.id3 = submission._id;
                }
              }
            }
          }
          //console.log(retq.id1);
          //console.log(retq);
          res.status(200).send(retq);
        }
      );
    } else {
      // user has not logged in yet, just return question
      res.status(200).send(retq);
    }
  });
};*/
