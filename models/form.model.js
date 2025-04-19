const mongoose = require('mongoose')


const FormSchema = new mongoose.Schema({
  name: { type: String },   
  Lname: { type: String },  
  ID: { type: Number }, 
  Fname: { type: String },   
  GFname: { type: String }, 
  BirthDay: { type: Number }, 
  Graduation: { type: Number }, 
  School: { type: String }, 
  Province: { type: String }, 
  ExamLang: { type: String }, 
  CenterName: { type: String }, 
  ExamPlace: { type: String }, 
  ExamTime: { type: String }, 
  studentID:{type: String},
  exMoney : {type: String},
  intMoney : {type: String}
});

module.exports = mongoose.model('Register-fomr-ST', FormSchema)

