const Appointment = require('../models/Appointment');
const Slot = require('../models/Slot');

// @desc    Book appointment (Patient only)
// @route   POST /api/appointments/book
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slotId } = req.body;

    // Check if slot exists and is not booked
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    if (slot.isBooked) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      slotId,
      status: 'pending'
    });

    // Mark slot as booked
    slot.isBooked = true;
    await slot.save();

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments (role based)
// @route   GET /api/appointments
const getAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === 'admin') {
      // Admin sees all appointments
      appointments = await Appointment.find()
        .populate('patientId', 'name email phone')
        .populate('doctorId', 'name specialization fees')
        .populate('slotId', 'date time');
    } else if (req.user.role === 'doctor') {
      // Doctor sees their appointments
      appointments = await Appointment.find({ doctorId: req.user._id })
        .populate('patientId', 'name email phone')
        .populate('slotId', 'date time');
    } else {
      // Patient sees their appointments
      appointments = await Appointment.find({ patientId: req.user._id })
        .populate('doctorId', 'name specialization fees')
        .populate('slotId', 'date time');
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = req.body.status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel appointment (Patient only)
// @route   DELETE /api/appointments/:id
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Free up the slot
    await Slot.findByIdAndUpdate(appointment.slotId, { isBooked: false });

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  cancelAppointment
};