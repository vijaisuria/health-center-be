const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const staff = require("../models/staff.model");

router.post("/signUp", async (req, res) => {
  try {
    const { name, staffId, dob, department, gender } = req.body;
    const existingUser = await staff.findOne({ staffId });
    if (existingUser) {
      return res.status(409).json({ error: "User already exist" });
    }

    const newStaff = new staff({
      name,
      staffId,
      dob,
      department,
      gender,
      password: dob.toString().slice(0, 10),
    });

    const savedStaff = await newStaff.save();
    res.status(201).json({
      message: "Staff signed up successfully",
      staff: newStaff,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Sign-up failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { staffId, password } = req.body;
    const Staff = await staff.findOne({ staffId: staffId });
    if (!Staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    if (password != Staff.password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({
      message: "Login succesful",
      student: {
        name: Staff.name,
        staffId: Staff.staffId,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
