const express = require("express");
const router = express.Router();
const fs = require("fs");

router.post("/problems", (req, res) => {
  console.log(req.body);
  fs.writeFile("userCode.txt", req.body.code, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    res.json({ message: "success" });
  });
});

module.exports = router;
