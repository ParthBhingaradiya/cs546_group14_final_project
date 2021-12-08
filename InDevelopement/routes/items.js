const express = require('express');
const router = express.Router();
const data = require('../data');
const items = data.items;
const path = require('path');
const multer = require('multer');
/////////////////////////////////////////Gets list of items.

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/img/');
    },

    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage })
router.get("/additem", async(req, res) => {
    if (req.session.userauth) {
        res.render(`product/productdetails`, { user: req.session.userauth });
    } else {
        res.redirect('/login')
    }
})

router.post("/additem", upload.array('uploaded_file'), async(req, res) => {


    try {
        let itemName = req.body.itemName;
        let description = req.body.description;
        let status = req.body.status;
        let itemPrice = Number(req.body.itemPrice);
        let photos = req.files.uploaded_file;
        let userId = req.session.userauth.user_id;
        let fileName = req.files.map((f_name) => {
            return f_name.originalname
        })
        let commentId = []
        const additem = await items.createItem(itemName, description, status, userId, itemPrice, commentId, fileName)
        res.redirect(`/`);
    } catch (e) {
        console.log(e, 'test');
        res.redirect(`/additem`, { err: e });
    }
})

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