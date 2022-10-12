const { fetchCategories, fetchUsers } = require('../db/models/model');

exports.getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        return res.status(200).send({categories: categories});
    })
}

exports.getUsers = (req, res, next) => {
    console.log('in the controller, <---');
    fetchUsers().then((users) => {
        return res.status(200).send({users: users})
    });
}