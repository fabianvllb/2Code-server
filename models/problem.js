const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class Problem {
  constructor() {}

  // Find problem by ID
  findById(id) {
    return prisma.problem.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }

  getAllQuestions(where) {
    if (where) {
      return prisma.problem.findMany({ where });
    }
    return prisma.problem.findMany();
  }

  getActiveQuestionsMinimal() {
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
