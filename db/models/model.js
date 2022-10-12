const db = require('../connection');


exports.fetchCategories = () => {
    console.log('in the model');
    return db.query(`SELECT * FROM categories;`).then(({rows}) => {
        return rows;
    })
}

exports.fetchUsers = () => {
    console.log('in the model, <---');
    return db.query(`SELECT * FROM users;`).then(({rows}) => {
        return (rows);
    })
}