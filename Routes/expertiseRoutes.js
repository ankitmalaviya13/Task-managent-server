const express = require("express");
const router = express.Router();
const {
  getExpertises,
  getALLExpertises,
  addExpertise,
  updateExpertise,
  deleteExpertise,
} = require("../Controllers/expertiseController");
const { protect } = require("../Middlewares/auth");

// //get Language profile
router.get("/", getExpertises);

// //get Language profile
router.get("/all", getALLExpertises);

//add Language profile
// router.post('/',addLanguage);
router.route("/").post(addExpertise);

// //update Language profile
router.put("/:id", updateExpertise);

// //Delete Language profile
router.delete("/:id", deleteExpertise);

module.exports = router;
