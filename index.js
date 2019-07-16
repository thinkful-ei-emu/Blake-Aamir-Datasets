require('dotenv').config; 
//console.log(process.env.API_TOKEN);
const express = require('express');
const morgan = require('morgan');
const movies = require('./movies');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

//making sure that our authorization header is valid
app.use(function validateBearerToken(req, res, next){
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  //console.log(authToken);
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});



const PORT = 8080; 
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});