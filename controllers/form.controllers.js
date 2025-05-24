const express = require('express');
const path = require('path');
const fs = require('fs');
const bwipjs = require('bwip-js');
const xlsx = require('xlsx');

const excelFilePath = path.join(__dirname, '..', 'data', 'students.xlsx');
const idConfigPath = path.join(__dirname, '..', 'data', 'id-config.json');

// اطمینان از وجود فولدر data
if (!fs.existsSync(path.dirname(excelFilePath))) {
  fs.mkdirSync(path.dirname(excelFilePath), { recursive: true });
}

// گرفتن مقدار startID از فایل config
const getStartID = () => {
  if (fs.existsSync(idConfigPath)) {
    const config = JSON.parse(fs.readFileSync(idConfigPath, 'utf-8'));
    return config.startID || 'S00001';
  }
  return 'S00001';
};

// تولید آی‌دی بعدی با پشتیبانی از پیشوندهای مختلف
const generateNextID = (lastID, startID) => {
  const prefixMatch = startID.match(/^\D+/); // استخراج حروف اول
  const prefix = prefixMatch ? prefixMatch[0] : '';
  const lastNumber = lastID ? parseInt(lastID.replace(prefix, '')) : parseInt(startID.replace(prefix, ''));
  return prefix + (lastNumber + 1).toString().padStart(5, '0');
};

// نمایش فرم ثبت‌نام
const GetForm = (req, res) => {
  res.render('form.ejs');
};

// ثبت فرم و تولید بارکد و ذخیره در Excel
const SetForm = async (req, res) => {
  try {
    let workbook, worksheet;
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

    const startID = getStartID();
    const lastID = data.length > 0 ? data[data.length - 1].studentID : null;
    const nextID = (!lastID || parseInt(lastID.replace(/\D+/g, '')) < parseInt(startID.replace(/\D+/g, '')))
      ? startID
      : generateNextID(lastID, startID);

    const newStudent = {
      ...req.body,
      studentID: nextID,
      intMoney: req.body.money === '30' ? 30 : '',
      exMoney: req.body.money === '50' ? 50 : '',
    };

    data.push(newStudent);

    const newSheet = xlsx.utils.json_to_sheet(data);
    const sheetName = 'Students';

    // حذف شیت قبلی در صورت وجود
    const existingSheetIndex = workbook.SheetNames.indexOf(sheetName);
    if (existingSheetIndex > -1) {
      delete workbook.Sheets[sheetName];
      workbook.SheetNames.splice(existingSheetIndex, 1);
    }

    xlsx.utils.book_append_sheet(workbook, newSheet, sheetName);
    xlsx.writeFile(workbook, excelFilePath);

    // تولید بارکد
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128',
      text: `ID: ${nextID}`,
      scale: 2,
      height: 6,
      textxalign: 'center',
    });

    const fileName = `barcode-${nextID}.png`;
    const barcodePath = path.join(__dirname, '..', 'public', 'barcodes', fileName);
    const barcodeDir = path.dirname(barcodePath);
    if (!fs.existsSync(barcodeDir)) fs.mkdirSync(barcodeDir, { recursive: true });
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

// تغییر آی‌دی شروع
const SetStartID = (req, res) => {
  const { newID } = req.body;

  if (!newID || newID.trim() === '') {
    return res.status(400).send('لطفاً یک آی‌دی وارد کنید.');
  }

  try {
    fs.writeFileSync(idConfigPath, JSON.stringify({ startID: newID }, null, 2));
    res.redirect('/form');
  } catch (error) {
    console.error('خطا در ذخیره آی‌دی جدید:', error);
    res.status(500).send('خطا در ذخیره آی‌دی جدید.');
  }
};

module.exports = { GetForm, SetForm, SetStartID };
