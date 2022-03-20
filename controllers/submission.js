const Submission = require("../models/submission");
const Problem = require("../models/problem");
const { DateTime } = require("luxon");
const RunnerManager = require("../judgingengine/RunnerManager");
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

/*exports.question_findByKeys = function(req, res, next) {
  SleepUtil.sleep();
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

exports.submission_create = async function (req, res, next) {
  let submission;
  // Search existing submission
  try {
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
  res.status(200).send(submission);
};

exports.submission_readone = function (req, res, next) {
  Submission.findById(parseInt(req.params.id), function (err, submission) {
    if (err) {
      return next(err);
    }
    res.status(200).send(submission);
  });
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

exports.submission_run = async function (req, res, next) {
  /**
   * Mandatory: userid, problemid, language
   * Optional: solution
   */
  console.log("**submission_run starts**");
  let submission;
  // Search existing submission
  //try {
  submission = await Submission.find({
    authorId: parseInt(req.body.userid),
    problemId: parseInt(req.body.problemid),
    language: req.body.language,
    status: "initial",
  });
  /*} catch (err) {
    res.status(422).json({ errors: [err] });
    return next(err);
  }*/

  if (!submission) {
    // If no submission is found
    console.log("No submission was found!");
    // Create new submission
    submission = new Submission(
      parseInt(req.body.userid),
      parseInt(req.body.problemid),
      req.body.solution,
      req.body.language,
      "initial", // not submitted -> just created
      DateTime.now().toISO(), //.toFormat("yyyy'-'LL'-'dd'T'HH':'mm':'ss'.'u'Z'"),
      DateTime.now().toISO() //.toFormat("yyyy'-'LL'-'dd'T'HH':'mm':'ss'.'u'Z'")
    );
    // Save new submission
    submission.create();
  } else {
    // If submission exists
    console.log("A submission was found!");
    // Update solution
    submission.solution = req.body.solution;
    submission.timeupdated = DateTime.now().toISO();
    try {
      submission.update(null);
    } catch (err) {
      res.status(422).json({ errors: [err] });
      return next(err);
    }
  }
  // Find submission's problem
  let problemUniquename = await Problem.getProblemUniquenameById(
    parseInt(req.body.problemid)
  );

  // Run submission
  run(req, res, next, submission, problemUniquename);
  //res.status(200).send(submission);
};

function run(req, res, next, submission, problemUniquename) {
  console.log("**Starting run function in submission.js**");
  // 1. Start runtime timer
  var start = DateTime.now();

  // 2. Then, run the solution to get the test result
  RunnerManager.run(
    problemUniquename,
    submission.language,
    submission.solution,
    function (status, message) {
      let result = {
        status,
        message,
      };
      console.log(status);
      if (status == "pass" || status == "fail") {
        var end = DateTime.now();

        var ms = end.diff(start, ["seconds", "milliseconds"]);
        console.log("Runtime: ", ms.toObject());
        /*var ms = moment(end, "DD/MM/YYYY HH:mm:ss").diff(
          moment(start, "DD/MM/YYYY HH:mm:ss")
        );*/

        // 3. Find the submission
        Submission.findById(submission.id, function (err, submission) {
          // update status
          submission.status = status;
          submission.runtime = ms.seconds + ms.milliseconds / 1000;
          submission.timesubmitted = DateTime.now().toISO();

          console.log(submission);
          // 4. Update the submission
          try {
            submission.update(function (err) {
              if (err) return next(err);
              res.end(JSON.stringify(result));
            });
          } catch (err) {
            res.status(422).json({ errors: [err] });
            return next(err);
          }
        });
      } else {
        res.end(JSON.stringify(result));
      }
    }
  );
}
