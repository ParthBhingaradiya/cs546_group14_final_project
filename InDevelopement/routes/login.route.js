const express = require('express');
const router = express.Router();
const data = require('../data');
const { ObjectId } = require("bson");
const users = data.users;
const xxs = require('xss');


const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get("/login", async(req, res) => {
    res.render(`login/login`);
})

router.post("/login", async(req, res) => {
    try {
        let email = xxs(req.body.username);
        let accountPassword = xxs(req.body.password);
        if(!email)
        {
            throw "Error: no email."
        }
        if(!accountPassword)
            throw "Error: no password."
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
        let firstName = xxs(req.body.firstName);
        let lastName = xxs(req.body.lastName);
        let email = xxs(req.body.username);
        let address = xxs(req.body.address);
        let city = xxs(req.body.city);
        let pincode = xxs(req.body.pincode);
        let state = xxs(req.body.state);
        let accountPassword = xxs(req.body.password);
        let cm_password = xxs(req.body.cmpassword);
        let age = Number(xxs(req.body.age));

        if (!firstName || !lastName || !email || !address || !city || !state || !pincode || !accountPassword || !age||cm_password)
        {
            throw ("One or more user details are missing. Enter again");
        }
        if (typeof age != 'number')
         throw ("age should be a number");
        if(age<0&&age>140)
            throw "Age cannot be negative."
        if (typeof firstName != 'string' || typeof lastName != 'string' || typeof email != 'string' || typeof address != 'string' || typeof city != 'string' || typeof pincode != 'string' || typeof state != 'string' || typeof accountPassword != 'string'|| typeof cm_password != 'string')
            throw ("One or more user information is of wrong type. Enter again.");

        if (!firstName.trim().length || !lastName.trim().length || !email.trim().length || !address.trim().length || !city.trim().length || !pincode.trim().length || !state.trim().length || !accountPassword.trim().length|| !cm_password.trim().length)
            throw ("One of more user information is only empty spaces. Enter again.");
        if (accountPassword.length < 6)
            throw ("password should be at-least 6 characters long");
        if (cm_password != accountPassword) 
            throw ("password should be match");
        if (!accountPassword.trim().length || accountPassword.trim().length < accountPassword.length)
            throw ("password should not contain empty spaces");
        var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
        if (!isValidZip.test(pincode))
            throw ("Pincode if invalid.Enter again");
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