const express = require('express');
const app = express();
const PORT = process.env.PORT | 3000;
// require('dotenv').config()

//StartUp
require('./startup/dbConnection')();
require('./startup/apolloServer')(app);


app.listen(PORT, () => {
  console.log(`This App is Running at ${PORT}`);
});