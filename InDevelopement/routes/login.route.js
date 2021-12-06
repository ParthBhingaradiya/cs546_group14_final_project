const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;


const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get("/login", async (req, res) => {
    res.render(`login/login`);
})

router.post("/login", async (req, res) => {
    try {
        let email = req.body.username;
        let accountPassword = req.body.password;
        let checkUser = await users.checkUser(email, accountPassword);
        res.redirect('/');
    } catch (e) {
        console.log(e, 'test');
        res.render(`login/login`, { err: e });
    }
})


router.get("/registration", async (req, res) => {
    res.render(`login/registration`);
})


module.exports = router;