const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const transactionsRoutes = require('./Routes/transactionsRoutes');
const userRoutes = require('./Routes/users');
const cors = require('cors');
const header = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true'
};

require('dotenv').config();

// Create HTTPS server with SSL certificates to local development
const options = {
  key: fs.readFileSync('../certs/localhost-key.pem'),
  cert: fs.readFileSync('../certs/localhost.pem'),
};

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(header)); // Enable CORS for all routes

app.use('/transactions', transactionsRoutes);
app.use(userRoutes);

https.createServer(options, app).listen(3001, () => {
  console.log('Servidor rodando em https://localhost:3001');
});