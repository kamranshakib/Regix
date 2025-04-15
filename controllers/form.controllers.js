const express = require('express');
const FormDB = require('../models/form.model')
const ejs = require('ejs');
const app = require('../app');

const GetForm = async(req, res) => {
 res.render('show.ejs')
};
const SetForm = async(req,res)=>{
    const newST = await new FormDB(req.body)
    res.status(201).json({'new-student' : newST})
}

module.exports = { SetForm, GetForm };
