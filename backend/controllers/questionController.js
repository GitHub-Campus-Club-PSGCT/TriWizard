const House = require("../models/House");
const Question = require("../models/Question");
const Submission = require("../models/Submission");

// GET question by house name & question number
const getQuestionByHouseAndNumber = async (req, res) => {
  try {
    const { houseName, questionNumber } = req.params;
    const { teamId } = req.query; // ✅ Get teamId from query params

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

    let codeToReturn = question.buggedCode; // Default to original buggy code
    
    // ✅ Check if there's an existing submission for this team and question
    if (teamId) {
      const existingSubmission = await Submission.findOne({ 
        teamId, 
        questionId: question._id 
      }).sort({ createdAt: -1 }); // Get the latest submission
      
      if (existingSubmission) {
        codeToReturn = existingSubmission.code; // Use submitted code instead
        console.log(`Found existing submission for team ${teamId}, question ${question._id}`);
      } else {
        console.log(`No existing submission found for team ${teamId}, question ${question._id}`);
      }
    }

    return res.json({
      success: true,
      question: {
        _id: question._id,
        questionNumber: question.questionNumber,
        questionDescription: question.questionDescription, // ✅ Include question description
        code: codeToReturn, // ✅ Return either buggy code or latest submission
        buggedCode: question.buggedCode, // Keep original for reference
        testCases: question.testCases
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getQuestionByHouseAndNumber };
