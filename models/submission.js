const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class Submission {
  //constructor(){}

  constructor(
    authorId,
    problemId,
    solution,
    language,
    status,
    timeupdated,
    timesubmitted
  ) {
    this.solution = solution;
    this.language = language;
    this.problemId = problemId;
    this.authorId = authorId;
    this.status = status;
    this.timeupdated = timeupdated;
    this.timesubmitted = timesubmitted;
    this.runtime = 0;
  }

  async save() {
    let data = await prisma.submission.create({ data: this });
    this.id = data.id;
  }

  async update(callback) {
    callback = callback || null;

    let data = await prisma.submission.update({
      where: {
        id: this.id,
      },
      data: this,
    });

    if (callback && !data) {
      callback(`Error on update - No submission with id ${this.id} found`);
    } else if (callback && data) {
      callback(undefined, data);
    }
    return;
  }

  setAllValues({
    solution,
    language,
    problemId,
    authorId,
    status,
    timeupdated,
    timesubmitted,
    runtime,
  }) {
    this.solution = solution;
    this.language = language;
    this.problemId = problemId;
    this.authorId = authorId;
    this.status = status;
    this.timeupdated = timeupdated;
    this.timesubmitted = timesubmitted;
    this.runtime = runtime;
  }

  static find(where) {
    let submission = new Submission();
    submission.setAllValues(prisma.submission.findMany({ where }));
    return submission;
  }

  static async findById(id, callback) {
    let submission;
    try {
      submission = await prisma.submission.findUnique({
        where: {
          id: parseInt(id),
        },
      });
    } catch (err) {
      callback(err, submission);
      return;
    }
    if (!submission) {
      callback(
        `Error on findById- No submission with id ${id} found`,
        submission
      );
    } else {
      callback(undefined, submission);
    }
    return;
  }
};
