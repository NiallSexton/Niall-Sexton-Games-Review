const db = require('../connection');

// function validateNumber() {

// }

exports.fetchCategories = () => {
    return db.query(`SELECT * FROM categories;`).then(({rows}) => {
        return rows;
    })
}

exports.fetchReviews = (review_id) => {
    if(isNaN(review_id)) {
        return Promise.reject({
            status: 400,
            message: 'Invalid id type',
        })
    }

    return db.query('SELECT reviews.*, COUNT(comment_id):: INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = $1 WHERE reviews.review_id = $1 GROUP BY reviews.review_id;',
    [review_id]).then((body) => {
        console.log(body.rows, 'body.rows');

        const user = body.rows[0];
        if (!user) {
            return Promise.reject({
                status: 404,
                message: 'Cant find review id',
            })
        }
        return (body.rows[0]);
    });
};

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users;`).then(({rows}) => {
        return (rows);
    })
}

exports.patchReviews = (review_id, votes) => {
    if(isNaN(review_id)) {
        return Promise.reject({
            status: 400,
            message: 'Invalid id type',
        })
    }
    if(isNaN(votes)) {
        return Promise.reject({
            status: 400,
            message: 'Invalid inc_votes type',
        })
    }
    return db.query(`UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *;`, [review_id, votes])
    .then(({rows}) => {
        if(rows.length > 0 ) {
            return (rows[0]);
        }
        return Promise.reject({
            status: 404,
            message: 'Cant find review id',
        })
    });
}

