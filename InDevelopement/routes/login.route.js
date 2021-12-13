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
        res.redirect('/');
    } catch (e) {
        res.render(`login/login`, { err: e });
    }
})


router.get("/registration", async(req, res) => {
    res.render(`login/registration`);
})

router.post("/registration", async(req, res) => {
    try {
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let email = req.body.username;
        let address = req.body.address;
        let city = req.body.city;
        let pincode = req.body.pincode;
        let state = req.body.state;
        let accountPassword = req.body.password;
        let cm_password = req.body.cmpassword;
        let age = Number(req.body.age);
        await users.createUser(firstName, lastName, email, address, city, pincode, state, accountPassword, age, cm_password);
        res.redirect(`/login`);
    } catch (e) {
        console.log(e, 'test');
        res.render(`login/registration`, { err: e });
    }
})

router.get('/logout', async(req, res) => {
    req.session.destroy(function(err) {
        console.log(err)
    })
    res.redirect('/');
});


module.exports = router;