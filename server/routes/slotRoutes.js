const express = require('express');
const router = express.Router();
const { addSlot, getSlots, deleteSlot } = require('../controllers/slotController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', getSlots); // Public
router.post('/', protect, authorizeRoles('doctor', 'admin'), addSlot);
router.delete('/:id', protect, authorizeRoles('doctor', 'admin'), deleteSlot);

module.exports = router;
