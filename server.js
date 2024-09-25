// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

app.get('/getInfuraCredentials', (req, res) => {
  const credentials = {
    infuraId: process.env.REACT_APP_INFURA_ID,
    infuraKey: process.env.REACT_APP_INFURA_SECRET_KEY
  };
  res.json(credentials);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
