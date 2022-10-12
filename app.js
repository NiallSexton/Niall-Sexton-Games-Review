const express = require('express');
const app = express();

const { getCategories, getReviews, getUsers } = require('./controllers/controller');

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviews);
app.get('/api/users', getUsers);

app.all('*', (req, res) => {
    res.status(404).send({message:'Wrong pathway'});
})

app.use((err,req,res,next) => {
    console.log(err)
    if (err.code === '22P02') {
    res.status(400).send({message: 'Invalid id type'})}
    else if (err.status) {
      res.status(404).send({message: 'Cant find review id'})}
      else
    {next(err)}})
    app.use((err,req,res,next) => {
      res.status(500).send({message: 'Something went wrong'})
      })
module.exports = app;