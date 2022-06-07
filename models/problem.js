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

  constructor(title, description, authorid, difficulty) {
    this.id = undefined;
    this.title = title;
    this.uniquename = Problem.stringToUniqueName(title);
    this.description = description;
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
      "INSERT INTO public.problem (title, uniquename, description, authorid, jsmain, cmain, javamain, difficulty, timecreated, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        this.title,
        this.uniquename,
        this.description,
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
      "UPDATE public.problem SET title = $1, uniquename = $2, description = $3, jsmain = $4, cmain = $5, javamain = $6, difficulty = $7, active = $8 WHERE id = $9",
      [
        this.title,
        this.uniquename,
        this.description,
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
        let problem = Problem.createProblemFromObject(data.rows[0]);
        return problem;
      } else {
        return null;
      }
    } catch (err) {
      return err;
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
        "SELECT id, title, difficulty FROM public.problem",
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
