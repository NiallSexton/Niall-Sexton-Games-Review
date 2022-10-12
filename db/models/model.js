const db = require('../connection');


exports.fetchCategories = () => {
    return db.query(`SELECT * FROM categories;`).then(({rows}) => {
        return rows;
    })
}

exports.fetchReviews = (review_id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id]).then((body) => {
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
    console.log('in the model, <---');
    return db.query(`SELECT * FROM users;`).then(({rows}) => {
        return (rows);
    })
}

