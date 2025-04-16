const express = require('express');
const FormDB = require('../models/form.model')
const ejs = require('ejs');
const app = require('../app');



const GetForm = async(req, res) => {
 res.render('form.ejs')
};
const SetForm = async(req,res)=>{
   const newStudent = await (req.body)
    const newST = await new FormDB(req.body)
    await newST.save()
    res.render('GetForm.ejs', { newStudent });
   
}
  
module.exports = { SetForm, GetForm };
