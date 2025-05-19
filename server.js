const { default: mongoose } = require('mongoose');
const app = require('./app');
require('dotenv').config()

    app.listen(`${process.env.PORT || 3000}`, () =>
      console.log(`server on port ${process.env.PORT}`)

  );

 