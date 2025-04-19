const express = require('express');
const FormDB = require('../models/form.model');
const ejs = require('ejs');
const app = require('../app');
const QRCode = require('qrcode');
const bwipjs = require('bwip-js');
const path = require('path');
const fs = require('fs');

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

    const barcodeText = ` آی‌دی: ${nextID} `;

    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128',
      text: barcodeText,
      scale: 1,
      height: 20,
      textxalign: 'center',
    });

    const fileName = `barcode-${nextID}.png`;
    const filePath = path.join(
      __dirname,
      '..',
      'public',
      'barcodes',
      fileName
    );
    fs.writeFileSync(filePath, barcodeBuffer);
    res.render('GetForm.ejs', {
      newStudent,
      studentID: nextID,
      barcodeImage: `/barcodes/${fileName}`,
    });
  } catch (error) {
    console.error('Error saving student:', error);
    res
      .status(500)
      .send(
        `خطا در ذخیره شاگرد: ${error.message}`
      );
  }
};

module.exports = { SetForm, GetForm };
