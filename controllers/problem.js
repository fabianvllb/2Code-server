const ValidationError = require("../models/validationerror");
const Problem = require("../models/problem");
const { DateTime } = require("luxon");
const User = require("../models/user");
const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

exports.question_create = async function (req, res, next) {
  let author;
  author = await User.findUserByUsername(req.body.username);

  // If author doesn't exist
  if (!author) {
    console.log("Usuario inexistente: ID del autor no encontrado");
    var error = new ValidationError(
      "body",
      "username",
      req.body.username,
      "Usuario no encontrado"
    );
    res.status(422).json({ errors: [error] });
    return;
  }

  // Check if problem's uniquename is not in use
  let newProblem;
  let uniquename = toUniqueName(req.body.title);
  newProblem = await Problem.findByUniquename(uniquename);

  if (!newProblem) {
    newProblem = new Problem(
      req.body.title,
      uniquename,
      req.body.description,
      author.id,
      req.body.jsmain,
      req.body.cmain,
      req.body.javamain,
      req.body.difficulty,
      DateTime.now().toISO()
    );
    // probamos a almacenar el nuevo problema en la base de datos
    try {
      newProblem.save();
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          console.log("No se puede crear el problema: ID ya existente");
        } else {
          console.log("Error durante la operacion CREATE");
        }
      }
      res.status(422).json({ errors: [e] });
      return next(e);
    }
    res.status(200).send(newProblem);
  } else {
    console.log("Uniquename ya existe: el uniquename del problema ya existe");
    var error = new ValidationError(
      "body",
      "title",
      req.body.title,
      "Uniquename ya existe"
    );
    res.status(422).json({ errors: [error] });
  }
};

function toUniqueName(value) {
  if (value) {
    let words = value.split(" ");
    let name = "";
    for (let i = 0; i < words.length; i++) {
      name += words[i].toLowerCase();
      name += "-";
    }
    name = name.slice(0, name.length - 1);
    return name;
  } else {
    return undefined;
  }
}

exports.question_readone = async function (req, res, next) {
  let problem;
  try {
    problem = await Problem.findById(req.params.id);
  } catch (err) {
    res.status(422).json({ errors: [err] });
    return next(err);
  }
  //console.log("id:", req.params.id, "problem:\n", problem);
  res.status(200).send(problem);
};

/*exports.question_update = function (req, res, next) {
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
};*/

exports.question_all = async function (req, res, next) {
  let problems;
  try {
    problems = await Problem.getAllActiveQuestionsMinimal();
  } catch (err) {
    res.status(422).json({ errors: [error] });
    return next(err);
  }
  res.status(200).send(problems);
};
