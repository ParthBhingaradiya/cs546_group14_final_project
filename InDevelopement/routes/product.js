const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;

router.get("/", async(req, res) => {
    res.render(`product/allproduct`, { user: req.session.userauth });
})

router.post("/", async(req, res) => {
    try {
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let email = req.body.username;
        let address = req.body.address;
        let city = req.body.city;
        let pincode = req.body.pincode;
        let state = req.body.state;
        let accountPassword = req.body.password;
        let age = Number(req.body.age);
        await users.createUser(firstName, lastName, email, address, city, pincode, state, accountPassword, age);
        res.render(`product/allproduct`);
    } catch (e) {
        console.log(e, 'test');
        res.render(`login/registration`, { err: e });
    }
})

router.get("/singleProduct", async(req, res) => {
    res.render(`product/singleproduct`);
})

router.get("/customerdetails", async(req, res) => {
    res.render(`product/customerdetails`);
})

router.get("/thankyou", async(req, res) => {
    res.render(`product/thankyou`);
})


module.exports = router;