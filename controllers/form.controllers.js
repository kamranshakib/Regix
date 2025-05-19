const express = require('express');
const path = require('path');
const fs = require('fs');
const bwipjs = require('bwip-js');
const xlsx = require('xlsx');

const excelFilePath = path.join(__dirname, '..', 'data', 'students.xlsx');


if (!fs.existsSync(path.dirname(excelFilePath))) {
  fs.mkdirSync(path.dirname(excelFilePath));
}


const GetForm = (req, res) => {
  res.render('form.ejs');
};


const generateNextID = (lastID) => {
  if (!lastID) return 'P24000000';
  const lastNumber = parseInt(lastID.replace('P240', ''));
  return 'P240' + (lastNumber + 1).toString().padStart(4, '0');
};

const SetForm = async (req, res) => {
  try {
    let workbook;
    let worksheet;
    let data = [];

    if (fs.existsSync(excelFilePath)) {

      workbook = xlsx.readFile(excelFilePath);
      const sheetName = 'Students';

      if (workbook.SheetNames.includes(sheetName)) {
        worksheet = workbook.Sheets[sheetName];
        data = xlsx.utils.sheet_to_json(worksheet);
      }
    } else {

      workbook = xlsx.utils.book_new();
    }

    const lastID = data.length > 0 ? data[data.length - 1].studentID : null;
    const nextID = generateNextID(lastID);

    const newStudent = {
      ...req.body,
      studentID: nextID,
      intMoney: req.body.money === '30' ? 30 : '',
      exMoney: req.body.money === '50' ? 50 : '',
    };


    data.push(newStudent);


    const newSheet = xlsx.utils.json_to_sheet(data);
    const sheetName = 'Students';


    const existingSheetIndex = workbook.SheetNames.indexOf(sheetName);
    if (existingSheetIndex > -1) {
      delete workbook.Sheets[sheetName];
      workbook.SheetNames.splice(existingSheetIndex, 1);
    }


    xlsx.utils.book_append_sheet(workbook, newSheet, sheetName);
    xlsx.writeFile(workbook, excelFilePath);


    const barcodeText = `آی‌دی: ${nextID}`;
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128',
      text: barcodeText,
      scale: 1,
      height: 10,
      textxalign: 'center',
    });


    const fileName = `barcode-${nextID}.png`;
    const barcodePath = path.join(__dirname, '..', 'public', 'barcodes', fileName);
    const barcodeDir = path.dirname(barcodePath);
    if (!fs.existsSync(barcodeDir)) {
      fs.mkdirSync(barcodeDir, { recursive: true });
    }
    fs.writeFileSync(barcodePath, barcodeBuffer);


    res.render('GetForm.ejs', {
      newStudent,
      studentID: nextID,
      barcodeImage: `/barcodes/${fileName}`,
    });

  } catch (error) {
    console.error('خطا در ذخیره شاگرد:', error);
    res.status(500).send(`خطا در ذخیره شاگرد: ${error.message}`);
  }
};

module.exports = { SetForm, GetForm };
