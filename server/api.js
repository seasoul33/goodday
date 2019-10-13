const express = require('express');
const router = express.Router();
const db = require('./dbInterface.js')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')

// Get all subscribers
router.get('/', (req, res) => {
});

// Get one subscriber
router.get('/:id', (req, res) => {
});

// Create one subscriber
router.post('/', (req, res) => {
});

// Update one subscriber
router.patch('/:id', (req, res) => {
});

// Delete one subscriber
router.delete('/:id', (req, res) => {
});

router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    const result = await db.registerUser(username, password);
    // TODO: Need more error handling
    if (result === 'existed') {
        res.send({ message: 'existed' });
    }
    res.end();
});

router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const userFound = await db.searchUser(username);
    const valid = (userFound.password === password);

    if (!valid) {
        res.status(401).send({ message: 'Invalid username or password' });
        return;
    }
    const accessToken = jsonwebtoken.sign({ username }, 'dummy');

    res.json({ token: accessToken })
});
router.get('/auth/user', jwt({ secret: 'dummy' }), (req, res, next) => {
    // console.log(req.user);
    res.json({ user: req.user })
})
router.post('/auth/logout', (req, res, next) => {
    res.json({ status: 'OK' })
});

module.exports = router