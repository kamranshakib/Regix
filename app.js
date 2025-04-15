const express = require('express');
const app = express();
const ejs = require('ejs')

//  REQUIRE ROUTES...
const SetForm = require('./routes/form.routes')

// PART OF MIDDELWARES...
app.use(express.json())
app.use(SetForm)
app.set('view engine ', ejs);


module.exports = app;
