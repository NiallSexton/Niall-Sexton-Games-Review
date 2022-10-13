const db = require('../connection');


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
                msg: 'Cant find review id',
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

