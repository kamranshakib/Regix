const express = require('express');
const FormDB = require('../models/form.model')

const SetForm = async(req, res) => {
 const newST = await new FormDB( req.body);
 await newST.save()
 await res.send(`${newST.name}   ${newST.Fname}  ${newST.Lname}`)
 
};

module.exports = { SetForm };
