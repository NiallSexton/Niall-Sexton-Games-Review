
const { fetchCategories, fetchUsers, fetchReviews } = require('../db/models/model');


exports.getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        return res.status(200).send({categories: categories});
    })
}

exports.getReviews = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviews(review_id).then((review) => {
        res.status(200).send({review});
    })
    .catch((err) => {
        console.log(err);
        next(err);
    });
}

exports.getUsers = (req, res, next) => {
    console.log('in the controller, <---');
    fetchUsers().then((users) => {
        return res.status(200).send({users: users})
    });
}
