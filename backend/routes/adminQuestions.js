const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getQuestionsByHouse,
  deleteQuestion
} = require("../controllers/adminQuestionController");

// Admin: Create question
router.post("/", createQuestion);

// Admin: Get all questions for a house
router.get("/:houseName", getQuestionsByHouse);

// Admin: Delete a question from a house
router.delete("/:houseName/:questionId", deleteQuestion);

module.exports = router;
