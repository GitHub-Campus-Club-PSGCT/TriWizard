const House = require("../models/House");
const Question = require("../models/Question");

// GET question by house name & question number
const getQuestionByHouseAndNumber = async (req, res) => {
  try {
    const { houseName, questionNumber } = req.params;

    if (!houseName || !questionNumber) {
      return res.status(400).json({ success: false, message: "Missing parameters" });
    }

    // Find the house
    const house = await House.findOne({ houseName }).populate("questionIds");
    if (!house) {
      return res.status(404).json({ success: false, message: "House not found" });
    }

    // Find the question inside that house
    const question = house.questionIds.find(
      (q) => q.questionNumber === parseInt(questionNumber)
    );

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    return res.json({
      success: true,
      question: {
        questionNumber: question.questionNumber,
        buggedCode: question.buggedCode,
        testCases: question.testCases
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getQuestionByHouseAndNumber };
