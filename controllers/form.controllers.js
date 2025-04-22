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

    if (req.body.money === '30') {
      newStudent.intMoney = 30;
    } else if (req.body.money === '50') {
      newStudent.exMoney = 50;
    }

    const newST = new FormDB(newStudent);
    await newST.save();

    const barcodeText = ` آی‌دی: ${nextID} `;

    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128',
      text: barcodeText,
      scale: 1,
      height: 10,
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
const getMoney = async (req, res) => {
  try {
    const data = await FormDB.find({},{ intMoney: 1, exMoney: 1, _id: 0 });
 
    const totalIntMoney = data.reduce((sum, item) => sum + (item.intMoney || 0),0);
    const totalExMoney = data.reduce((sum, item) => sum + (item.exMoney
       || 0), 0)
    res.json({
      totalIntMoney,
      totalExMoney,
    });
  } catch (error) {
    console.error('خطا:', error);
    res
      .status(500)
      .json({ message: 'خطا در جمع پول‌ها' });
  }
};


module.exports = { SetForm, GetForm, getMoney };
