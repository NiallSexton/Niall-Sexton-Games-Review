
const { fetchCategories, fetchUsers, fetchReviewsById, patchReviews, fetchReviews } = require('../db/models/model');


exports.getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        return res.status(200).send({categories: categories});
    })
}

exports.getReviewsById = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviewsById(review_id).then((review) => {
        res.status(200).send({review});
    })
    .catch((err) => {
        next(err);
    });
}

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        return res.status(200).send({users: users})
    });
}

exports.patchReviewsById = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
    
    patchReviews(review_id, inc_votes).then((rows) => {
        return res.status(200).send({rows});
    })
    .catch(next);
}

exports.getReviews = (req, res, next) => {
    console.log('in the controller');
    const { sort_by, order, category } = req.query;
    fetchReviews(sort_by, order, category).then((rows) => {
        return res.status(200).send();
    })
}
