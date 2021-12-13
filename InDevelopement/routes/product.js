const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;
const items = data.items;
const xxs = require('xss');
router.get("/", async (req, res) => {
    let itemData = await items.getItemList();
    if (req.session.userauth) {
        let userId = req.session.userauth.user_id
        const viewCart = await users.showCartItem(userId);
        const addwishlist = await users.showWishlistItem(userId)
        if (addwishlist != null) {
            console.log(addwishlist, 'test');
            const wishitem = await items.findaddTocartItem(addwishlist)
            req.session.wishlist = { cartlength: wishitem.length };
        }
        if (viewCart != null) {
            const cartitem = await items.findaddTocartItem(viewCart)
            req.session.cartitem = { cartlength: cartitem.length };
        }
    } else {
        req.session.cartitem = 0;
        req.session.wishlist = 0;
    }
    res.render(`product/allproduct`, { user: req.session.userauth, itemDatas: itemData, cart: req.session.cartitem, wishlist: req.session.wishlist });
})

router.post("/", async (req, res) => {
    try {
        let firstName = xxs(req.body.firstName);
        let lastName = xxs(req.body.lastName);
        let email = xxs(req.body.username);
        let address = xxs(req.body.address);
        let city = xxs(req.body.city)
        let pincode = xxs(req.body.pincode);
        let state = xxs(req.body.state);
        let accountPassword = xxs(req.body.password);
        let age = Number(xxs(req.body.age));
        if(!firstName||!lastName||!email||!address||!city||!pincode||!state||!accountPassword||!age)
        {
            throw "Error: Missing an element"
        }
        if(firstName.trim().length<=0||lastName.trim().length<=0||email.trim().length<=0||address.trim().length<=0||city.trim().length<=0||pincode.trim().length<=0||state.trim().length<=0)
        {
            throw "Error: input is empty";
        }
        if(age<0&&age>140)
        {
            throw "Error: Bad age."
        }
        await users.createUser(firstName, lastName, email, address, city, pincode, state, accountPassword, age);
        res.render(`product/allproduct`);
    } catch (e) {
        res.render(`login/registration`, { err: e });
    }
})

router.get("/singleitem/:id", async (req, res) => {
    let id = req.params.id;
    let itemData = await items.findItem(id);
    let userData = await users.getSingleUser(itemData.userId)
    res.render(`product/singleproduct`, { user: req.session.userauth, cart: req.session.cartitem, itemDatas: itemData, userDatas: userData, wishlist: req.session.wishlist });
})


router.get("/about", async (req, res) => {
    res.render(`userproduct/about`, { user: req.session.userauth, cart: req.session.cartitem, wishlist: req.session.wishlist });
})

router.get("/profile", async (req, res) => {
    let userId = req.session.userauth.user_id
    let userData = await users.getSingleUser(userId)
    res.render(`userproduct/profile`, { user: req.session.userauth, cart: req.session.cartitem, userData: userData, wishlist: req.session.wishlist });
})

router.post('/search', async (req, res) => {
    let searchTerm = req.body.searchItem;
    let itemData = await items.searchItem(searchTerm);
    res.render(`product/searchitem`, { user: req.session.userauth, itemDatas: itemData, cart: req.session.cartitem, wishlist: req.session.wishlist });
})

module.exports = router;