const express = require('express');
const app = express();

//  REQUIRE ROUTES...
const SetForm = require('./routes/form.routes')

// PART OF MIDDELWARES...
app.use(express.json())
app.use(SetForm)


module.exports = app;
