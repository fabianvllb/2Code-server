var express = require("express");
var router = express.Router();
var note_controller = require("../controllers/note");

router.post("/", note_controller.note_read);
router.put("/", note_controller.note_update);

module.exports = router;
