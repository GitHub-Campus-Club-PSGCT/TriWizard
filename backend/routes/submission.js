const express = require("express");
const router = express.Router();
const { createSubmission } = require("../controllers/submissionController");

// POST /submission -> accepts { questionId, teamId?, language?, code }
router.post("/", createSubmission);

const Submission = require("../models/Submission");

router.get("/:id", async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, submission });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// OPTIONAL: later we'll add GET /submission/:id to fetch results
module.exports = router;
