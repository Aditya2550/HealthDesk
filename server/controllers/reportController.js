const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Total appointments per doctor
// @route   GET /api/reports/appointments-per-doctor
const appointmentsPerDoctor = async (req, res) => {
  try {
    const data = await Appointment.aggregate([
      {
        $group: {
          _id: '$doctorId',
          totalAppointments: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'doctor',
        },
      },
      { $unwind: '$doctor' },
      {
        $project: {
          doctorName: '$doctor.name',
          specialization: '$doctor.specialization',
          totalAppointments: 1,
        },
      },
      { $sort: { totalAppointments: -1 } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Appointments grouped by status
// @route   GET /api/reports/appointments-by-status
const appointmentsByStatus = async (req, res) => {
  try {
    const data = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Revenue per doctor (appointments × fees)
// @route   GET /api/reports/revenue-per-doctor
const revenuePerDoctor = async (req, res) => {
  try {
    const data = await Appointment.aggregate([
      {
        $match: { status: { $in: ['confirmed', 'completed'] } },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctor',
        },
      },
      { $unwind: '$doctor' },
      {
        $group: {
          _id: '$doctorId',
          doctorName: { $first: '$doctor.name' },
          specialization: { $first: '$doctor.specialization' },
          fees: { $first: '$doctor.fees' },
          appointmentCount: { $sum: 1 },
        },
      },
      {
        $project: {
          doctorName: 1,
          specialization: 1,
          appointmentCount: 1,
          totalRevenue: { $multiply: ['$fees', '$appointmentCount'] },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { appointmentsPerDoctor, appointmentsByStatus, revenuePerDoctor };
