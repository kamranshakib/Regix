const express = require('express');
const route = express.Router();

const Set = require('../controllers/form.controllers');

route.get('/form', Set.GetForm);
route.post('/register', Set.SetForm);


route.post('/set-start-id',Set.SetStartID); // روت برای تغییر آی‌دی شروع

module.exports = route;
