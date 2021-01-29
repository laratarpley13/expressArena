const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('Playstore App', () => {
    it('should expect the response to be an array', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array');
            });
    })
    it('should return a 400 status code if sort is provided but is not Rating or App value', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: "Test" })
            .expect(400)
    })
    it('should return 400 status is genre is not a valid category option', () => {
        return supertest(app)
            .get('/apps')
            .query({ genre: "Test" })
            .expect(400)
    })
    it('should return an array when provided valid sort and genre query', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: "App", genre: "Puzzle" })
            .then(res => {
                expect(res.body).to.be.an('array');
            })
    })
})