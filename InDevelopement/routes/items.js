const express = require('express');
const router = express.Router();
const data = require('../data');
const items = data.items;
/////////////////////////////////////////Gets list of items.

router.get("/myitem", async(req, res) => {
    let userId = req.session.userauth.user_id
    let itemData = await items.findUserItem(userId);
    res.render(`userproduct/ownproduct`, { user: req.session.userauth, itemDatas: itemData });
})

router.post('/search', async(req, res) => {
        let searchTerm = req.body.searchItem;
        let itemData = await items.searchItem(searchTerm);
        res.render(`product/searchitem`, { user: req.session.userauth, itemDatas: itemData });
    })
    /////////////////////////////////////////////Gets single item.

router.get("/checkout", async(req, res) => {
    let id = req.query.id;
    res.render(`product/customerdetails`, { id: id, user: req.session.userauth });
})

router.post("/thankyou", async(req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let address = req.body.address;
    let phone_no = req.body.phone_no;
    let email = req.body.email;
    let card_name = req.body.card_name;
    let cvv = req.body.cvv;
    let expiry_date = req.body.expiry_date;
    let itemData = await items.boughtItem(id);
    res.render(`product/thankyou`);
})

router.get("/soldItem", async(req, res) => {
    let userId = req.session.userauth.user_id
    let itemData = await items.getSoldItemList(userId);
    res.render(`userproduct/ownproduct`, { user: req.session.userauth, itemDatas: itemData });
})
router.get("/cart", async(req, res) => {

    res.render(`product/cart`, { user: req.session.userauth });
})

router.get("/wishlist", async(req, res) => {

    res.render(`product/wishlist`, { user: req.session.userauth });
})

router.get('/:id', async(req, res) => {

    })
    ////////////////////////////////////////////
router.post('/:id', async(req, res) => {

    })
    ////////////////////////////////////////////Take you to a form.
router.get('/newPost', async(req, res) => {

    })
    ///////////////////////////////////////////Post from the form
router.post('/newPost', async(req, res) => {

})
module.exports = router;