const express = require('express');
const router = express.Router();
const {
  appointmentsPerDoctor,
  appointmentsByStatus,
  revenuePerDoctor,
} = require('../controllers/reportController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/appointments-per-doctor', protect, authorizeRoles('admin'), appointmentsPerDoctor);
router.get('/appointments-by-status', protect, authorizeRoles('admin'), appointmentsByStatus);
router.get('/revenue-per-doctor', protect, authorizeRoles('admin'), revenuePerDoctor);

module.exports = router;
