const db = require("../models/db");
const { DateTime } = require("luxon");

module.exports = class Submission {
  constructor(problemId, language, authorId, solution, status) {
    this.id = undefined;
    this.problemId = problemId;
    this.language = language;
    this.authorId = authorId;
    this.solution = solution;
    this.status = status;
    this.runtime = 0;
    this.timeupdated = undefined;
    this.timesubmitted = undefined;
  }

  static async findSubmissionById(id) {
    try {
      const data = await db.query(
        "SELECT * FROM public.submission WHERE id = $1",
        [id]
      );
      if (data.rowCount != 0) {
        const submission = Submission.createSubmissionFromObject(data.rows[0]);
        return submission;
      } else {
        return null;
      }
    } catch (err) {
      return err;
    }
  }

  /**
   *
   * @param {number} problemId
   * @param {number} userId
   * @returns last updated submission for given problem and user and language
   */
  static async findLastSubmissionForProblem(problemId, userId, language) {
    try {
      const data = await db.query(
        //"SELECT DISTINCT ON (language) * FROM public.submission WHERE problemId = $1 AND authorId = $2 ORDER BY timeupdated DESC"
        'SELECT DISTINCT ON ("language") * FROM public.submission WHERE "problemId" = $1 AND "authorId" = $2 AND "language" = $3 ORDER BY "language", timeupdated DESC',
        [problemId, userId, language]
      );
      if (data.rowCount != 0) {
        const submission = Submission.createSubmissionFromObject(data.rows[0]);
        return submission;
      } else {
        return null;
      }
    } catch (err) {
      console.log("error on query: ", err);
      throw err;
    }
  }

  /**
   * Compiles and runs the submited code (submission).
   * Mandatory params:
   * @param {number} problemId - The problem's id.
   * @param {string} language - The language of the submited solution.
   * @param {number} userId - The submitting user's id.
   * @param {string} status - The current status of the submission ("pending", "success", "fail").
   */
  static async findSubmissionByLanguageAndStatus(
    problemId,
    language,
    userId,
    status
  ) {
    try {
      const data = await db.query(
        'SELECT * FROM public.submission WHERE "problemId" = $1 AND "language" = $2 AND "authorId" = $3 AND "status" = $4',
        [problemId, language, userId, status]
      );
      if (data.rowCount != 0) {
        const submission = Submission.createSubmissionFromObject(data.rows[0]);
        return submission;
      } else {
        return null;
      }
    } catch (err) {
      console.log("error on query: ", err);
      throw err;
    }
  }

  static async getAllSubmissionsByAuthorId(authorid) {
    try {
      let data = await db.query(
        'SELECT s.id, p.uniquename, s."language", s.status, s.runtime, s.timeupdated FROM public.submission as s, public.problem as p WHERE s."problemId"=p.id AND s."authorId"=$1 ORDER BY s.timeupdated DESC',
        [authorid]
      );
      return data.rows;
    } catch (err) {
      throw err;
    }
  }

  static createSubmissionFromObject(obj) {
    let submission = new Submission(
      obj.problemId,
      obj.language,
      obj.authorId,
      obj.solution,
      obj.status
    );
    if (obj.id) submission.id = obj.id;
    submission.runtime = obj.runtime;
    submission.timeupdated = obj.timeupdated;
    submission.timesubmitted = obj.timesubmitted;
    return submission;
  }

  async insertToDB() {
    try {
      let currentTime = DateTime.now().toISO();
      let res = await db.query(
        'INSERT INTO public.submission ("problemId", "language", "authorId", "solution", "status", runtime, timeupdated, timesubmitted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          this.problemId,
          this.language,
          this.authorId,
          this.solution,
          this.status,
          this.runtime,
          currentTime,
          currentTime,
        ]
      );
      return res.rowCount;
    } catch (err) {
      console.log("error at submission insertToDB: ", err);
      throw err;
    }
  }

  async updateToDB() {
    try {
      let res = await db.query(
        "UPDATE public.submission SET solution = $1, status = $2, runtime = $3, timeupdated = $4 WHERE id = $5",
        [
          this.solution,
          this.status,
          this.runtime,
          DateTime.now().toISO(),
          this.id,
        ]
      );
      return res.rowCount;
    } catch (err) {
      console.log("error at submission updateToDB: ", err);
      throw err;
    }
  }
};
