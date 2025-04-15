const { default: mongoose } = require('mongoose');
const app = require('./app');
require('dotenv').config()

mongoose
  .connect('mongodb://localhost:27017/Omid-project')
  .then(() =>
    app.listen(`${process.env.PORT || 3000}`, () =>
      console.log(`server on port ${process.env.PORT}`)
    )
  )
  .catch((err) => {
    console.log(err);
  });

 