const express = require("express");
const router = express.Router();
const { getQuestionByHouseAndNumber } = require("../controllers/questionController");

// GET /questions/:houseName/:questionNumber
router.get("/:houseName/:questionNumber", getQuestionByHouseAndNumber);

module.exports = router;
