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

  const {searchType, search} = req.query;
  if(!searchType || !search){
    let returnString = (!searchType? ' no searchtype, ': '') + (!search? ' no search': '');
    return res.status(404).send(returnString);
  }
  if(!(searchType === 'genre' || searchType === 'country' ||searchType === 'avg_vote' )){
    return res.status(404).send('invalid seachType');
  }
  if(searchType === 'genre' ){
    console.log('it ran');
    const myArray = movies.filter(movie => {
      return (movie.genre.includes(search));
    });
    return res.json(myArray);
  }
  if(searchType === 'country' ){
    let newArray = movies;
    const myArray = newArray.filter(movie => {
      return (movie.country.includes(search));
    });
    return res.json(myArray);
  }
  if(searchType === 'avg_vote' ){
    const voteNum = parseFloat(search);
    const myArray = movies.filter(movie => {
      return (movie.avg_vote >= voteNum);
    });
    return res.json(myArray);
  }



});


const PORT = 8080; 
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});