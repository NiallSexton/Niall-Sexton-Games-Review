const db = require('../connection');
const categories = require('../data/test-data/categories');

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
category = "all") => {

    let columnsOfInterest = [
        'review_id',
        'title',
        'designer',
        'owner',
        'category',
        'created_at',
        'votes',
    ];
    //This variable has all of the possible categories
    let possibleCategories = [
        'all',
        'euro_game',
        'dexterity',
        'social_deduction',
        "children's_games",
    ];
    // console.log(sort_by, order, category);
    let orderOptions = ['asc', 'desc'];
    // If sort by doesnt exsist in columnsOfInterest return an error
    if(!columnsOfInterest.includes(sort_by)) {
        return Promise.reject({status: 400, message: 'Invalid sort query'});
    }
    // If the category doesnt exsist in possible categories return an error
    if(!possibleCategories.includes(category)) {
        return Promise.reject({status: 400, message: 'Invalid category value'});
    }
    // If order is not one of the order options return an error
    if(!orderOptions.includes(order)) {
        return Promise.reject({status: 400, message: 'Invalid order query'});
    }
    
    let categoryQuery = "";
    if(category !== "all") {
        categoryQuery = `WHERE reviews.category = \'${category}\'`
    }
    
    const queryStr = `
    SELECT reviews.category, reviews.created_at, reviews.designer, reviews.owner, reviews.review_id, reviews.review_img_url, reviews.title, reviews.votes, COUNT(comments.comment_id):: INT AS comment_count 
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id ${categoryQuery} 
    GROUP BY reviews.review_id 
    ORDER BY ${sort_by} ${order};`

    // console.log(queryStr);

    return db.query( queryStr)
    .then((body) => {
        return body.rows;
    });

    }
//     return db.query (`SELECT reviews.category, reviews.created_at, reviews.designer, reviews.owner, reviews.review_id, reviews.review_img_url, reviews.title, reviews.votes, COUNT(comments.comment_id):: INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id;`)
//     .then(({rows}) => {
//         console.log(rows, '<---');
//     })
// }

exports.fetchCommentsById = (id) => {
    console.log(id);
    return db.query(`SELECT * FROM comments WHERE review_id = $1`, [id]).then(({rows}) => {
        // console.log(rows, "<----------------");
        return rows;
    })
}

exports.addCommentsById = (id, postComment) => {
    const { author, body } = postComment;
    console.log(author, body);
    return db.query(`INSERT INTO comments(body, author, review_id) VALUES($1, $2,$3) RETURNING *;`, [body, author, id]).then(({rows}) => {
        console.log(rows);
        return rows;
    })
}