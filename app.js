const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');


const isPackaged = __dirname.includes('app.asar');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicPath = isPackaged
  ? path.join(process.resourcesPath, 'public') // وقتی پکیج شده
  : path.join(__dirname, 'public');           // وقتی در حالت توسعه است

app.use(express.static(publicPath));

// ROUTES
const SetForm = require('./routes/form.routes');
app.use(SetForm);

module.exports = app;
