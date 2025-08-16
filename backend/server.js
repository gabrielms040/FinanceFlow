const express = require('express');
const bodyParser = require('body-parser');
const transactionsRoutes = require('./Routes/transactionsRoutes');
const userRoutes = require('./Routes/users');
const cors = require('cors');
const header = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

require('dotenv').config();


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(header)); // Enable CORS for all routes


app.use('/transactions', transactionsRoutes);
app.use(userRoutes);

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
