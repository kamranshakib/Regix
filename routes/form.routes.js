const express = require('express');
const route = express.Router();

const Set = require('../controllers/form.controllers');

route.get('/', Set.GetForm);
route.post('/register', Set.SetForm);
route.get('/payment',Set.getMoney)

module.exports = route;
