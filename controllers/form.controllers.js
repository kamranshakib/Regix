const express = require('express');
const FormDB = require('../models/form.model');
const ejs = require('ejs');
const app = require('../app');

const GetForm = async (req, res) => {
  res.render('form.ejs');
};

const SetForm = async (req, res) => {
  try {
    const lastStudent = await FormDB.findOne()
      .sort({ studentID: -1 })
      .exec();

    let nextID = 'P24000000';

    if (lastStudent && lastStudent.studentID) {
      const lastIDNumber = parseInt(
        lastStudent.studentID.replace('P240', '')
      );
      nextID =
        'P240' +
        (lastIDNumber + 1)
          .toString()
          .padStart(4, '0');
    }

    const newStudent = {
      ...req.body,
      studentID: nextID,
    };

    const newST = new FormDB(newStudent);

    await newST.save();

    res.render('GetForm.ejs', {
      newStudent,
      studentID:nextID
    });
  } catch (error) {
    console.error('Error saving student:', error);

    res
      .status(500)
      .send(
        `Error occurred while saving the student: ${error.message}`
      );
  }
};

module.exports = { SetForm, GetForm };
