const House = require("../models/House");
const Question = require("../models/Question");

// ================== CREATE QUESTION ==================
const createQuestion = async (req, res) => {
  try {
    const { houseName, questionNumber, buggedCode, testCases } = req.body;

    if (!houseName || !questionNumber || !buggedCode || !testCases) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // Check if house exists
    let house = await House.findOne({ houseName });
    if (!house) {
      return res.status(404).json({ success: false, message: "House not found" });
    }

    // Create question
    const newQuestion = new Question({ questionNumber, buggedCode, testCases });
    await newQuestion.save();

    // Link to house
    house.questionIds.push(newQuestion._id);
    await house.save();

    res.status(201).json({ success: true, question: newQuestion });
  } catch (err) {
    console.error("createQuestion error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================== GET ALL QUESTIONS FOR A HOUSE ==================
const getQuestionsByHouse = async (req, res) => {
  try {
    const { houseName } = req.params;

    const house = await House.findOne({ houseName }).populate("questionIds");
    if (!house) {
      return res.status(404).json({ success: false, message: "House not found" });
    }

    res.json({ success: true, questions: house.questionIds });
  } catch (err) {
    console.error("getQuestionsByHouse error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================== DELETE QUESTION ==================
const deleteQuestion = async (req, res) => {
  try {
    const { houseName, questionId } = req.params;

    // Remove question from Question collection
    const deleted = await Question.findByIdAndDelete(questionId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    // Remove reference from House
    await House.updateOne(
      { houseName },
      { $pull: { questionIds: questionId } }
    );

    res.json({ success: true, message: "Question deleted successfully" });
  } catch (err) {
    console.error("deleteQuestion error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createQuestion, getQuestionsByHouse, deleteQuestion };
