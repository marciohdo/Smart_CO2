// server.js
const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

app.get('/', function (req, res) {
res.send('Variaveis infura ok!');
});

app.listen(port, () => {
  console.info(`Server is running on port ${port}`);
});
