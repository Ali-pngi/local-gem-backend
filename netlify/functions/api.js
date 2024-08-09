const dotenv = require('dotenv');
dotenv.config();
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');


const usersRouter = require('../../controllers/users');
const profilesRouter = require('../../controllers/profiles');
const placesRouter = require('../../controllers/places.js');

const app = express();

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/places', placesRouter);


module.exports.handler = serverless(app);
