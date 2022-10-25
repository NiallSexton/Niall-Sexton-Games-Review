const express = require('express');
const app = express();

const { getCategories, getReviewsById, getUsers, patchReviewsById, getReviews, getCommentsById, postCommentsById } = require('./controllers/controller');

app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviewsById);
app.get('/api/users', getUsers);
app.patch('/api/reviews/:review_id', patchReviewsById);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id/comments', getCommentsById)
app.post('/api/reviews/:review_id/comments', postCommentsById)

app.all('*', (req, res) => {
    res.status(404).send({message:'Wrong pathway'});
})

app.use((err,req,res,next) => {
    if (err.code === '22P02') {
    res.status(400).send({message: 'Database error - invalid type'})}
    else if (err.status) {
      res.status(err.status).send({message: err.message})}
      else
    {next(err)}})
    app.use((err,req,res,next) => {
        console.log(err);
      res.status(500).send({message: 'Something went wrong'})
      })
module.exports = app;