const express = require("express");
const router = express.Router();
const Student = require("../models/student.model");

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a particular student by ID
router.get("/:id", getStudent, (req, res) => {
  res.json(res.student);
});

router.get("/reg/:regno", (req, res) => {
  if (req.params.regno == null) {
    return res.status(404).json({ message: "Student not found" });
  }
  Student.findOne({ registerNumber: req.params.regno })
    .then((student) => {
      res.status(200).json(student);
    })
    .catch((err) => res.status(400).json({ message: err.message }));
});

// Create a new student
router.post("/", async (req, res) => {
  const student = new Student({
    name: req.body.name,
    registerNumber: req.body.registerNumber,
    dob: req.body.dob,
    department: req.body.department,
    gender: req.body.gender,
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a student by ID
router.patch("/:id", getStudent, async (req, res) => {
  if (req.body.name != null) {
    res.student.name = req.body.name;
  }
  if (req.body.registerNumber != null) {
    res.student.registerNumber = req.body.registerNumber;
  }
  if (req.body.dob != null) {
    res.student.dob = req.body.dob;
  }
  if (req.body.department != null) {
    res.student.department = req.body.department;
  }
  if (req.body.gender != null) {
    res.student.gender = req.body.gender;
  }

  try {
    const updatedStudent = await res.student.save();
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a student by ID
router.delete("/:id", getStudent, async (req, res) => {
  try {
    await res.student.remove();
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a particular student by ID
async function getStudent(req, res, next) {
  try {
    const student = await Student.findById(req.params.id);
    if (student == null) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.student = student;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
