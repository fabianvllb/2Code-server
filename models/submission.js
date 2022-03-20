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

  async create() {
    let data = await prisma.submission.create({ data: this });
    //this.id = data.id;
    this.setAllValues(data);
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
    id,
    solution,
    language,
    problemId,
    authorId,
    status,
    timeupdated,
    timesubmitted,
    runtime,
  }) {
    this.id = id;
    this.solution = solution;
    this.language = language;
    this.problemId = problemId;
    this.authorId = authorId;
    this.status = status;
    this.timeupdated = timeupdated;
    this.timesubmitted = timesubmitted;
    this.runtime = runtime;
  }

  printThis() {
    console.log("this printed");
  }

  static async find(where) {
    let submission;
    const data = await prisma.submission.findMany({ where });
    //console.log("data found: ", data);
    if (data[0]) {
      submission = new Submission();
      submission.setAllValues(data[0]);
    }
    //console.log("submission: ", submission);
    return submission;
  }

  static async findById(id, callback) {
    const submission = new Submission();
    let data;
    try {
      data = await prisma.submission.findUnique({
        where: {
          id,
        },
      });
    } catch (err) {
      callback(err, data);
      return;
    }
    if (!data || data == undefined) {
      callback(`Error on findById- No submission with id ${id} found`, data);
    } else {
      submission.setAllValues(data);
      callback(undefined, submission);
    }
    return;
  }
};
