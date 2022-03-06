const ValidationError = require("../models/validationerror");
const ProblemService = require("../models/problem");
const userService = require("../models/user");
const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

exports.question_create = async function (req, res, next) {
  const author = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
    select: {
      id: true,
    },
  });
  // si no se encuentra al autor
  if (!author) {
    console.log("Usuario inexistente: ID del autor no encontrado");
    var error = new ValidationError(
      "body",
      "username",
      req.body.username,
      "Usuario inexistente!"
    );
    res.status(422).json({ errors: [error] });
  }

  let newProblem;
  // probamos a almacenar el nuevo problema en la base de datos
  try {
    newProblem = await prisma.problem.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        jsmain: req.body.jsmain,
        cmain: req.body.cmain,
        javamain: req.body.javamain,
        content: req.body.content,
        difficulty: req.body.difficulty,
        authorId: author.id,
        //frequency: req.body.frequency,
        //rating: req.body.rating,
        //hints: req.body.hints,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        console.log("No se puede crear el problema: ID ya existente");
      } else {
        console.log("Error durante la operacion CREATE");
      }
    }
    return next(e);
  }
  res.status(200).send(newProblem);
};

exports.question_readone = async function (req, res, next) {
  const problemService = new ProblemService();
  let problem;
  try {
    problem = await problemService.findById(req.params.id);
  } catch (err) {
    res.status(422).json({ errors: [error] });
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
  const problemService = new ProblemService();
  let problems;
  try {
    problems = await problemService.getActiveQuestionsMinimal();
  } catch (err) {
    res.status(422).json({ errors: [error] });
    return next(err);
  }
  res.status(200).send(problems);
};
