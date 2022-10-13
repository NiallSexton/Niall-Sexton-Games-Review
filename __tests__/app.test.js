const seed = require('../db/seeds/seed');
const request = require('supertest');
const db = require('../db/connection');
const app = require('../app.js');
const testData = require('../db/data/test-data');

beforeEach(() => seed(testData));

afterAll(() => {
    if (db.end) 
    {return db.end()}
});

describe('app', () => {
    describe('/api', () => {
        describe('categories', () => {
            describe('GET /api/categories', () => {
                test('200: responds with an array of categories', () => {
                    return request(app)
                    .get('/api/categories')
                    .expect(200)
                    .then(({body:{categories}}) => {
                    expect(categories.length).toBe(4);
                    categories.forEach((category) => {
                        expect(category).toEqual(
                            expect.objectContaining({
                                slug: expect.any(String),
                                description: expect.any(String)
                            })
                        );
                    });
                    });
                });
            });
        });
    });
});
describe('Error 404: bad pathway', () => {
    test('should return status 404 and a message when a wrong pathway is given', () => {
        return request(app)
        .get('/api/wrongpath')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('Wrong pathway');
        })
    });
});

describe('app', () => {
    describe('/api', () => {
        describe('/api/reviews', () => {
            describe('/api/reviews/:reviews_id', () => {
                test('should return a status 200 and an object with the review properties', () => {
                    return request(app)
                    .get('/api/reviews/2')
                    .expect(200)
                    .then(({body:{review}}) => {
                        expect(review).toEqual(
                            expect.objectContaining({
                                review_id: expect.any(Number),
                                title: expect.any(String),
                                designer: expect.any(String),
                                owner: expect.any(String),
                                review_img_url: expect.any(String),
                                review_body: expect.any(String),
                                category: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: 3,
                            })
                        )
                    })
                });
                test('Error 404: bad pathway', () => {
                    return request(app)
                        .get('/api/reviews/7272')
                        .expect(404)
                        .then(({body}) => {
                            expect(body).toEqual({message:'Cant find review id'});
                        })
                });
                test('Error 400: Invalid data type', () => {
                    return request(app)
                    .get('/api/reviews/Risk')
                    .expect(400)
                    .then(({body}) => {
                        expect(body).toEqual({message: 'Invalid id type'});
                    })
                })
            });
        });
    });
});

describe('GET /api/users', () => {
    test('should return status 200, repsponds with an array of objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body:{users}}) => {
            expect(users.length).not.toBe(0);
            users.forEach((user) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String),
                    })
                )
            })
        })
    });
    test('should return status 404 and a message when a wrong pathway is given', () => {
        return request(app)
        .get('/wrongpath')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('Wrong pathway');
        })
    }); 
});

describe('patchReviewsById', () => {
    test('should respond with a status code 200 and returns an updated review object with the votes changed based on the the inputted votes', () => {
        return request(app)
        .patch('/api/reviews/1')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({body}) => {
            expect(body.rows).toEqual({
                review_id: 1,
                title: 'Agricola',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_img_url:
                  'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: 'Farmyard fun!',
                category: 'euro game',
                created_at: "2021-01-18T10:00:20.514Z",
                votes: 2 
            })
        })
    });
    describe('Error testing', () => {
        test('Error 400: Invalid data type', () => {
            return request(app)
            .patch('/api/reviews/wrongDataType')
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({body}) => {
                expect(body).toEqual({message: 'Invalid id type'});
            })
        });
        test('Error 400: Invalid data type', () => {
            return request(app)
            .patch('/api/reviews/1')
            .send({ inc_votes: 'a' })
            .expect(400)
            .then(({body}) => {
                expect(body).toEqual({message: 'Invalid inc_votes type'});
            })
        });
        test('Error 404: Cant find review id', () => {
            return request(app)
            .patch('/api/reviews/7272')
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({body}) => {
                expect(body).toEqual({message: 'Cant find review id'});
            })
        });
    });
});