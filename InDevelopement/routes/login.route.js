const express = require('express');
const router = express.Router();
const data = require('../data');
const { ObjectId } = require("bson");
const users = data.users;


const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get("/login", async(req, res) => {
    res.render(`login/login`);
})

router.post("/login", async(req, res) => {
    try {
        let email = req.body.username;
        let accountPassword = req.body.password;
        let checkUser = await users.checkUser(email, accountPassword);
        console.log(checkUser);
        let userId = ObjectId(checkUser._id).toString();
        req.session.userauth = { name: checkUser.firstName + ' ' + checkUser.lastName, email: checkUser.email, user_id: userId };
        res.redirect('/item');
    } catch (e) {
        res.render(`login/login`, { err: e });
    }
})


router.get("/registration", async(req, res) => {
    res.render(`login/registration`);
})

router.get('/logout', async(req, res) => {
    req.session.destroy();
    res.redirect('/item');
});


module.exports = router;