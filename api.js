const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser')

const app = new express();

mongoose.connect('mongodb://localhost:27017/test-homie-db');
mongoose.connection.on('connected', () => {
  console.log('connected to mongod');
});

mongoose.connection.on('error', () => {
  console.log('failed to connect to mongod');
});

// const db = require('./config/keys').mongoURI;

// mongoose
//     .connect(db)
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.log(err))

app.use(express.json())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(require('./controllers'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`))