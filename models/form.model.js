const mongoose = require('mongoose')


const FormSchema = new mongoose.Schema({
    name:{type: String},                // اسم شاگرد
    Lname: {type:String},              // تخلص
    ID: {type:Number},                // ایدی
    Fname: {type:String},            // اسم پدر
    GFname: {type:String},          // اسم پدرکلان
    BirthDay: {type:Number},       // روز تولد
    Graduation: {type:Number},    // سال فراغت
    School: {type:String},       // مکتب
    Province: {type:Number},    // ولایت
    ExamLang: {type:String},   // زبان امتحان
    CenterName: {type:String},// اسم مرکز
    ExamPlace: {type:String},// مکان امتحان
    ExamTime: {type:String},//زمان امتحان
})

module.exports = mongoose.model('Register-fomr-ST', FormSchema)

