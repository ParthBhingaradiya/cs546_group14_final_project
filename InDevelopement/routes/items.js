const express = require('express');
const router = express.Router();
const data = require('../data');
const items = data.items;
const users = data.users;
const comments = data.comments;
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
        res.render(`product/productdetails`, { user: req.session.userauth, cart: req.session.cartitem });
    } else {
        res.redirect('/login')
    }
})


router.post("/additem", upload.array('uploaded_file'), async(req, res) => {
    if (req.session.userauth) {

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
    } else {
        res.redirect('/login')
    }
})

router.get("/myitem", async(req, res) => {
    if (req.session.userauth) {
        let userId = req.session.userauth.user_id
        let itemData = await items.findUserItem(userId);
        res.render(`userproduct/ownproduct`, { user: req.session.userauth, itemDatas: itemData, cart: req.session.cartitem });
    } else {
        res.redirect('/login')
    }
})

router.post('/search', async(req, res) => {
        let searchTerm = req.body.searchItem;
        let itemData = await items.searchItem(searchTerm);
        res.render(`product/searchitem`, { user: req.session.userauth, itemDatas: itemData, cart: req.session.cartitem });
    })
    /////////////////////////////////////////////Gets single item.

router.get("/checkout", async(req, res) => {
    if (req.session.userauth) {
        let id = req.query.id;
        res.render(`product/customerdetails`, { id: id, user: req.session.userauth, cart: req.session.cartitem });
    } else {
        res.redirect('/login')
    }
})

router.post("/thankyou", async(req, res) => {
    if (req.session.userauth) {
        let id = req.body.id;
        let userId = req.session.userauth.user_id
        let name = req.body.name;
        let address = req.body.address;
        let phone_no = req.body.phone_no;
        let email = req.body.email;
        let card_name = req.body.card_name;
        let cvv = req.body.cvv;
        let expiry_date = req.body.expiry_date;
        let priviouspurchage = await users.addPurchaseItem(userId, id);
        let itemData = await items.boughtItem(id);
        res.render(`product/thankyou`, { user: req.session.userauth, cart: req.session.cartitem });
    } else {
        res.redirect('/login')
    }

})

router.get("/soldItem", async(req, res) => {
    if (req.session.userauth) {
        let userId = req.session.userauth.user_id
        let itemData = await items.getSoldItemList(userId);
        res.render(`userproduct/ownproduct`, { user: req.session.userauth, itemDatas: itemData, cart: req.session.cartitem });
    } else {
        res.redirect('/login')
    }
})

router.get("/purchased", async(req, res) => {
    if (req.session.userauth) {
        let userId = req.session.userauth.user_id;
        let itemData = await users.showPreviousPurchaseItem(userId);
        const itemDatas = await items.findaddTocartItem(itemData)
        const getcmt = await comments.getUserComment(userId);
        res.render(`userproduct/previouslypurchased`, { user: req.session.userauth, itemDatas: itemDatas, cart: req.session.cartitem, getcmt: getcmt });
    } else {
        res.redirect('/login')
    }

})
router.get("/cart", async(req, res) => {
    if (req.session.userauth) {

        let userId = req.session.userauth.user_id
        const viewCart = await users.showCartItem(userId)
        const cartitem = await items.findaddTocartItem(viewCart)
        req.session.cartitem = { cartlength: cartitem.length };
        let sum = 0;
        cartitem.forEach((sumprice) => {
            sum = sumprice.itemPrice + sum;
        })
        res.render(`product/cart`, { user: req.session.userauth, cart: req.session.cartitem, grandTotal: sum, cart: req.session.cartitem, cartitem: cartitem });
    } else {
        res.redirect('/login')
    }
})

router.get("/addtocart", async(req, res) => {
    if (req.session.userauth) {
        let id = req.query.id;
        let userId = req.session.userauth.user_id
        const addtocart = await users.addToCartitem(userId, id)
        res.redirect('/item/cart')
    } else {
        res.redirect('/login')
    }
})

router.get("/addreview", async(req, res) => {
    if (req.session.userauth) {
        let user_id = req.query.id;
        const getcmt = await comments.getUserComment(user_id);
        res.render(`product/addreview`, { user: req.session.userauth, userid: user_id, getcmt: getcmt.length });
    } else {
        res.redirect('/login')
    }
})

router.post("/addreview", async(req, res) => {
    if (req.session.userauth) {
        let userId = req.body.userid;
        let content = req.body.contetnt;
        let rating = req.body.rating;
        const addcmt = await comments.createComment(userId, content, rating);
        res.redirect('/item/purchased')
    } else {
        res.redirect('/login')
    }
})

router.get("/review", async(req, res) => {
    if (req.session.userauth) {
        let id = req.query.id;
        let name = req.query.name;
        const getcmt = await comments.getUserComment(id);
        let avgrate = 0;
        getcmt.forEach((datas) => {
            avgrate = Number(datas.rating) + avgrate;
        })
        let avgnumber = Number(avgrate / getcmt.length);
        res.render(`product/itemreview`, { user: req.session.userauth, getcmt: getcmt, name: name, avgnumber: avgnumber });
    } else {
        res.redirect('/login')
    }
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