const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc    Add a doctor (Admin only)
// @route   POST /api/doctors
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      gender,
      specialization,
      experience,
      fees,
    } = req.body;

    const doctorExists = await User.findOne({ email });
    if (doctorExists) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctor = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      phone,
      gender,
      specialization,
      experience,
      fees,
    });

    res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      role: doctor.role,
      specialization: doctor.specialization,
      experience: doctor.experience,
      fees: doctor.fees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor (Admin only)
// @route   PUT /api/doctors/:id
const updateDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete doctor (Admin only)
// @route   DELETE /api/doctors/:id
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addDoctor, getAllDoctors, updateDoctor, deleteDoctor };
