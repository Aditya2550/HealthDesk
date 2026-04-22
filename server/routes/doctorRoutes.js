const express = require("express");
const router = express.Router();
const {
  addDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Public route - anyone can view doctors
router.get("/", getAllDoctors);

// Admin only routes
router.post("/", protect, authorizeRoles("admin"), addDoctor);
router.put("/:id", protect, authorizeRoles("admin"), updateDoctor);
router.delete("/:id", protect, authorizeRoles("admin"), deleteDoctor);

module.exports = router;
