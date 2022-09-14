const db = require("../models/db");

module.exports = class Note {
  constructor(problemid, authorid, content) {
    this.id = undefined;
    this.problemid = problemid;
    this.authorid = authorid;
    this.content = content;
  }

  async insertToDB() {
    let res = await db.query(
      "INSERT INTO public.note (problemid, authorid, content) VALUES ($1, $2, $3)",
      [this.problemid, this.authorid, this.content]
    );
    return res.rowCount;
  }

  async updateToDB() {
    let res = await db.query(
      "UPDATE public.note SET content = $1 WHERE id = $2",
      [this.content, this.id]
    );
    return res.rowCount;
  }

  static async findNoteById(id) {
    try {
      const data = await db.query("SELECT * FROM public.note WHERE id = $1", [
        id,
      ]);
      console.log("pruebaa");
      if (data.rowCount != 0) {
        const note = Note.createNoteFromObject(data.rows[0]);
        return note;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  static async findNoteByProblemidAndAuthorid(problemid, authorid) {
    try {
      const data = await db.query(
        "SELECT * FROM public.note WHERE problemid = $1 AND authorid = $2",
        [problemid, authorid]
      );
      if (data.rowCount != 0) {
        const note = Note.createNoteFromObject(data.rows[0]);
        return note;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  static createNoteFromObject(obj) {
    let note = new Note(obj.problemid, obj.authorid, obj.content);
    if (obj.id) note.id = obj.id;
    return note;
  }
};
