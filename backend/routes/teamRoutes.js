const express = require("express");
const { getTeamsByHouse } = require("../controllers/teamController"); // <- must match above

const router = express.Router();
console.log("getTeamsByHouse is:", getTeamsByHouse);

router.get("/:houseName", getTeamsByHouse); // <- must be a function

module.exports = router;
