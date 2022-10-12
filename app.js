const express = require('express');
const app = express();
const { getCategories, getUsers } = require('./controllers/controller');

app.get('/api/categories', getCategories);
app.get('/api/users', getUsers);

app.all('*', (req, res) => {
    res.status(404).send({message:'Wrong pathway'});
})

module.exports = app;