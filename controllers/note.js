const Note = require("../models/note");

exports.note_read = async function (req, res) {
  try {
    const note = await Note.findNoteByProblemidAndAuthorid(
      req.body.problemid,
      req.body.authorid
    );
    if (note) {
      res.status(200).send(note);
    } else {
      res.status(404).json({ status: "NOTE_NOT_FOUND" });
    }
  } catch (err) {
    return res.status(422).json({ errors: [err] });
  }
};

exports.note_update = async function (req, res) {
  let note;
  try {
    note = await Note.findNoteByProblemidAndAuthorid(
      req.body.problemid,
      req.body.authorid
    );
  } catch (err) {
    return res.status(422).json({ errors: [err] });
  }
  //if note exists
  if (note) {
    note.content = req.body.content;
    note.updateToDB();
    return res.status(200).json({ status: "UPDATE" });
  } else {
    note = new Note(req.body.problemid, req.body.authorid, req.body.content);
    note.insertToDB();
    return res.status(200).json({ status: "CREATE" });
  }
};
