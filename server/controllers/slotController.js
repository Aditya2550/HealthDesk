const Slot = require('../models/Slot');

// @desc    Add a slot (Doctor/Admin)
// @route   POST /api/slots
const addSlot = async (req, res) => {
  try {
    const { date, time } = req.body;
    const slot = await Slot.create({
      doctorId: req.user._id,
      date,
      time,
    });
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get slots for a doctor (Public)
// @route   GET /api/slots?doctorId=xxx
const getSlots = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const filter = doctorId ? { doctorId, isBooked: false } : { isBooked: false };
    const slots = await Slot.find(filter).populate('doctorId', 'name specialization');
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a slot (Doctor/Admin)
// @route   DELETE /api/slots/:id
const deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    await Slot.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addSlot, getSlots, deleteSlot };
