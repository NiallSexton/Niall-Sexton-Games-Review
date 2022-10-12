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
        .get('/wrongpath')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('Wrong pathway');
        })
    });
});

describe.only('GET /api/users', () => {
    test('should return status 200, repsponds wit an array of objects', () => {
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