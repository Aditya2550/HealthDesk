const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, getAppointments);                                           // All roles (filtered by role inside controller)
router.post('/book', protect, authorizeRoles('patient'), bookAppointment);           // Patient only
router.put('/:id/status', protect, authorizeRoles('doctor', 'admin'), updateAppointmentStatus); // Doctor/Admin
router.delete('/:id', protect, authorizeRoles('patient'), cancelAppointment);        // Patient only

module.exports = router;
