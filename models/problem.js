const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const db = require("../models/db");

module.exports = class Problem {
  /*this.id = "";
  this.title;
  this.uniquename;
  this.description;
  this.authorid;
  let jsmain;
  let cmain;
  let javamain;
  this.content; //TODO remove this eventually. Also from prisma schema.
  this.difficulty;
  let submissions;
  this.createdAt;
  let active;*/

  constructor(title, description, help, tests, authorid, difficulty) {
    this.id = undefined;
    this.title = title;
    this.uniquename = Problem.stringToUniqueName(title);
    this.description = description;
    this.help = help;
    this.tests = tests;
    this.authorid = authorid;
    this.jsmain = "";
    this.cmain = "";
    this.javamain = "";
    this.difficulty = difficulty;
    this.timecreated = undefined;
    this.active = undefined;
  }

  async insertToDB() {
    let res = await db.query(
      "INSERT INTO public.problem (title, uniquename, description, help, tests, authorid, jsmain, cmain, javamain, difficulty, timecreated, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
      [
        this.title,
        this.uniquename,
        this.description,
        this.help,
        this.tests,
        this.authorid,
        this.jsmain,
        this.cmain,
        this.javamain,
        this.difficulty,
        this.timecreated,
        this.active,
      ]
    );
    return res.rowCount;
  }

  async updateToDB() {
    let res = await db.query(
      "UPDATE public.problem SET title = $1, uniquename = $2, description = $3, help = $4, tests = $5, jsmain = $6, cmain = $7, javamain = $8, difficulty = $9, active = $10 WHERE id = $11",
      [
        this.title,
        this.uniquename,
        this.description,
        this.help,
        this.tests,
        this.jsmain,
        this.cmain,
        this.javamain,
        this.difficulty,
        this.active,
        this.id,
      ]
    );
    return res.rowCount;
  }

  // Find problem by ID
  static async findProblemById(id) {
    try {
      const data = await db.query(
        "SELECT * FROM public.problem WHERE id = $1",
        [id]
      );
      if (data.rowCount != 0) {
        const problem = Problem.createProblemFromObject(data.rows[0]);
        return problem;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  static async findByUniquename(uniquename) {
    let data = await db.query(
      "SELECT * FROM public.problem WHERE uniquename = $1",
      [uniquename]
    );
    if (data.rowCount != 0) {
      let problem = Problem.createProblemFromObject(data.rows[0]);
      return problem;
    } else {
      return null;
    }
  }

  static createProblemFromObject(obj) {
    let problem = new Problem(
      obj.title,
      obj.description,
      obj.help,
      obj.tests,
      obj.authorid,
      obj.difficulty
    );
    problem.jsmain = obj.jsmain;
    problem.cmain = obj.cmain;
    problem.javamain = obj.javamain;
    problem.timecreated = obj.timecreated;
    problem.active = obj.active;
    if (obj.id) problem.id = obj.id;
    return problem;
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

  static async getAllActiveQuestionsMinimal() {
    try {
      const data = await db.query(
        "SELECT id, title, difficulty FROM public.problem WHERE active=true",
        []
      );
      if (data) {
        return data.rows;
      } else {
        return null;
      }
    } catch (err) {
      return err;
    }
  }

  static async getAllActiveQuestionsMinimalOrderBy(property) {
    try {
      let data;
      if (property === "id") {
        data = await db.query(
          "SELECT id, title, difficulty FROM public.problem WHERE active=true ORDER BY id"
        );
      } else if (property === "difficulty") {
        data = await db.query(
          'SELECT p.id, p.title, p.difficulty, s2.status FROM public.problem p, (SELECT DISTINCT ON (s."problemId") s."problemId", s.status, s."authorId" FROM public.submission s WHERE s.status=\'pass\' AND s."authorId"=$1 ORDER BY s."problemId" ) s2 WHERE p.active=true AND s2."problemId"=p.id ORDER BY p.difficulty, p.id',
          [$1]
        );
      }
      return data.rows;
    } catch (err) {
      return err;
    }
  }

  static stringToUniqueName(text) {
    if (text) {
      let words = text.split(" ");
      let uniqueName = "";
      for (let i = 0; i < words.length; i++) {
        uniqueName += words[i].toLowerCase();
        uniqueName += "-";
      }
      uniqueName = uniqueName.slice(0, uniqueName.length - 1);
      return uniqueName;
    } else {
      return null;
    }
  }
};

/*exports.createQuestion = (data) => {
  return prisma.problem.create({ data });
};
exports.getQuestions = () => {};
exports.getOneQuestion = () => {};
exports.updateQuestion = () => {};
exports.deleteQuestion = () => {};*/
