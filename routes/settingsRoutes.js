const express = require("express");

const {
  getSettings,
  updateSettings
} = require("../controllers/settingsController");

const protect =
  require("../middleware/authMiddleware");


const router =
  express.Router();


// =====================================
// GET SETTINGS
// =====================================

router.get(
  "/",
  protect,
  getSettings
);


// =====================================
// UPDATE SETTINGS
// =====================================

router.put(
  "/",
  protect,
  updateSettings
);


module.exports = router;