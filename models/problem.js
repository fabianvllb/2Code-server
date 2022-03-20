const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class Problem {
  /*this.id = "";
  this.title;
  this.uniquename;
  this.description;
  this.authorId;
  let jsmain;
  let cmain;
  let javamain;
  this.content; //TODO remove this eventually. Also from prisma schema.
  this.difficulty;
  let submissions;
  this.createdAt;
  let active;*/

  constructor(
    title,
    uniquename,
    description,
    authorId,
    jsmain,
    cmain,
    javamain,
    difficulty,
    timecreated
  ) {
    this.title = title;
    this.uniquename = uniquename;
    this.description = description;
    this.authorId = authorId;
    (this.jsmain = jsmain),
      (this.cmain = cmain),
      (this.javamain = javamain),
      (this.difficulty = difficulty);
    this.timecreated = timecreated;
    this.active = false;
  }

  async save() {
    let data = await prisma.problem.create({ data: this });
    this.id = data.id;
  }

  // Find problem by ID
  static findById(id) {
    return prisma.problem.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }

  static findByUniquename(uniquename) {
    return prisma.problem.findUnique({
      where: {
        uniquename,
      },
    });
  }

  static async getProblemUniquenameById(id) {
    let problem = await prisma.problem.findUnique({
      where: {
        id,
      },
      select: {
        uniquename: true,
      },
    });
    return problem.uniquename;
  }

  static getAllProblems(where) {
    if (where) {
      return prisma.problem.findMany({ where });
    }
    return prisma.problem.findMany();
  }

  static getAllActiveQuestionsMinimal() {
    return prisma.problem.findMany({
      where: {
        active: true,
      },
      select: {
        title: true,
        difficulty: true,
      },
    });
  }
};

/*exports.createQuestion = (data) => {
  return prisma.problem.create({ data });
};
exports.getQuestions = () => {};
exports.getOneQuestion = () => {};
exports.updateQuestion = () => {};
exports.deleteQuestion = () => {};*/
