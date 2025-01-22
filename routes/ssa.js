const express = require('express');
const formidable = require('express-formidable');
const { login, listAccounts } = require('../services/aps.js');

let router = express.Router();

router.post('/api/login', formidable({ maxFileSize: Infinity }), async function (req, res, next) {
    try {
        const accessToken = await login(req.fields['username'], req.fields['password']);
        res.json(accessToken);
    } catch (err) {
        next(err);
    }
});

router.get('/api/accounts', async function (req, res, next) {
    try {
        const accounts = await listAccounts(req.headers.authorization);
        res.json(accounts);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
