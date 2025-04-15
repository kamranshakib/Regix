const express = require('express');
const route = express.Router();

const Set = require('../controllers/form.controllers');

route.get('/', Set.SetForm);

module.exports = route;
