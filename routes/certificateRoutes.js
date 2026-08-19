const express = require("express");

const router =
  express.Router();

const {
  createCertificate,
  getMyCertificates,
  getCertificate,
  verifyCertificate
} = require("../controllers/certificateController");

const authMiddleware =
  require("../middleware/authMiddleware");


// ==========================================
// CREATE CERTIFICATE
// ==========================================

router.post(
  "/course/:courseId",
  authMiddleware,
  createCertificate
);


// ==========================================
// GET MY CERTIFICATES
// ==========================================

router.get(
  "/my-certificates",
  authMiddleware,
  getMyCertificates
);


// ==========================================
// GET ONE CERTIFICATE
// ==========================================

router.get(
  "/:certificateId",
  authMiddleware,
  getCertificate
);

// ==========================================
// VERIFY CERTIFICATE
// ==========================================

router.get(
  "/verify/:certificateId",
  verifyCertificate
);

module.exports = router;