const db = require('../connection');

// function validateNumber() {

// }

exports.fetchCategories = () => {
    return db.query(`SELECT * FROM categories;`).then(({rows}) => {
        return rows;
    })
}

exports.fetchReviewsById = (review_id) => {
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

exports.fetchReviews = (sort_by = 'created_at',
order = 'desc',
category) => {

    let reviewArray = [
        'review_id',
        'title',
        'designer',
        'owner',
        'review_img_url',
        'category',
        'created_at',
        'votes',
    ];

    let categoryArray = [
        'euro_game',
        'dexterity',
        'social_deduction',
        "children's_games",
    ];

    let orderOptions = ['asc', 'desc'];

    if(![reviewArray].includes(sort_by)) {
        return Promise.reject({status: 400, message: 'Invalid sort query'});
    }
    
    if(![orderOptions].includes(order)) {
        return Promise.reject({status: 400, message: 'Invalid order query'});
    }
    const categoryQuery = `WHERE reviews.category = $1`

    const queryStr = `
    SELECT reviews.category, reviews.created_at, reviews.designer, reviews.owner, reviews.review_id, reviews.review_img_url, reviews.title, reviews.votes, COUNT(comments.comment_id):: INT AS comment_count 
    FROM reviews 
    LEFT JOIN comments ON comments.review_id ${categoryQuery} 
    GROUP BY reviews.review_id 
    ORDER BY ${sort_by} ${order};`

    return db.query( queryStr, [category])
    .then((rows) => {
        console.log(rows, '<---');
    })

    }
//     return db.query (`SELECT reviews.category, reviews.created_at, reviews.designer, reviews.owner, reviews.review_id, reviews.review_img_url, reviews.title, reviews.votes, COUNT(comments.comment_id):: INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id;`)
//     .then(({rows}) => {
//         console.log(rows, '<---');
//     })
// }

