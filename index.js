require('dotenv').config; 
//console.log(process.env.API_TOKEN);
const express = require('express');
const morgan = require('morgan');
const movies = require('./movies.json');
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



app.get('/movie' ,(req , res) => {
  let myArray = movies;
  const {genre, country, avg_vote} = req.query;
  

  if(genre){
    console.log('genre: ' + genre );
    myArray = myArray.filter(movie => {
      return (movie.genre.includes(genre));
    });
  }
  if(country){
    console.log('country: ' + country);
    myArray = myArray.filter(movie => {
      return (movie.country.includes(country));
    });
  }
  if(avg_vote){
    const voteNum = parseFloat(avg_vote);
    myArray = myArray.filter(movie => {
      return (movie.avg_vote >= voteNum);
    });
  }

  return res.json(myArray);

});


const PORT = 8080; 
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});