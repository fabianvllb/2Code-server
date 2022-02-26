//var Question = require("../models/question");
//const ValidationError = require("../models/validationerror");
//const SleepUtil = require("../utils/").SleepUtil;
const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

exports.question_create = async function (req, res, next) {
  //SleepUtil.sleep();
  try {
    await prisma.problem.create({
      data: {
        /*title: "Two sum",
        content: req.body.problem,
        author: req.body.username,
        authorId: userId,
        language: req.body.language,
        solution: req.body.solution,*/
        sequence: req.body.sequence,
        title: req.body.title,
        uniquename: req.body.uniquename,
        description: req.body.description,
        mainfunction: req.body.mainfunction,
        jsmain: req.body.jsmain,
        pythonmain: req.body.pythonmain,
        solution: req.body.solution,
        difficulty: req.body.difficulty,
        frequency: req.body.frequency,
        rating: req.body.rating,
        hints: req.body.hints,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        console.log("No se puede crear el problema: ID ya existente");
      } else {
        console.log("Error during CREATE operation");
      }
    }
    throw e;
  }

  /*var question = new Question({
    //sequence: req.body.sequence,
    title: req.body.title,
    uniquename: req.body.uniquename,
    description: req.body.description,
    mainfunction: req.body.mainfunction,
    jsmain: req.body.jsmain,
    pythonmain: req.body.pythonmain,
    solution: req.body.solution,
    difficulty: req.body.difficulty,
    frequency: req.body.frequency,
    rating: req.body.rating,
    hints: req.body.hints,
  });

  // almacenar en BD
  question.save({ new: true }, function (err, question) {
    if (err) {
      return next(err);
    }
    res.status(200).send(question);
  });*/
};

exports.question_readone = function (req, res, next) {
  //SleepUtil.sleep();
  Question.findById(req.params.id, function (err, question) {
    if (err) {
      return next(err);
    }
    res.status(200).send(question);
  });
};

exports.question_update = function (req, res, next) {
  //SleepUtil.sleep();
  console.log(req.body);
  Question.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true },
    function (err, question) {
      if (err) return next(err);
      res.status(200).send(question);
    }
  );
};

exports.question_delete = function (req, res, next) {
  //SleepUtil.sleep();
  Question.findByIdAndRemove(req.params.id, function (err, question) {
    if (err) return next(err);
    res.status(200).send(question);
  });
};

exports.question_all = function (req, res, next) {
  //SleepUtil.sleep();
  Question.find({})
    .sort({ sequence: "asc" })
    .exec(function (err, questions) {
      if (err) return next(err);
      res.status(200).send(questions);
    });
};
