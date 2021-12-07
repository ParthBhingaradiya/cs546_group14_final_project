const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;
const items = data.items;

router.get("/", async(req, res) => {
    let itemData = await items.getItemList();
    res.render(`product/allproduct`, { user: req.session.userauth, itemDatas: itemData });
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

router.get("/:id", async(req, res) => {
    let id = req.params.id;
    let itemData = await items.findItem(id);
    let userData = await users.getSingleUser(itemData.userId)
    res.render(`product/singleproduct`, { user: req.session.userauth, itemDatas: itemData, userDatas: userData });
})



module.exports = router;