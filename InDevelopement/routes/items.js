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
    res.render(`product/productdetails`, { user: req.session.userauth, wishlist: req.session.wishlist, cart: req.session.cartitem });
})


router.post("/additem", upload.array('uploaded_file'), async(req, res) => {
    try {
        let itemName = req.body.itemName;
        let description = req.body.description;
        let status = req.body.status;
        let itemPrice = Number(req.body.itemPrice);
        let userId = req.session.userauth.user_id;
        let fileName = req.files.map((f_name) => {
            return f_name.originalname
        })

        let commentId = []
        const additem = await items.createItem(itemName, description, status, userId, itemPrice, commentId, fileName)
        res.redirect(`/`);
    } catch (e) {
        console.log(e);
        res.render(`product/productdetails`, { err: e });
    }
})

router.get("/myitem", async(req, res) => {
    let userId = req.session.userauth.user_id
    let itemData = await items.findUserItem(userId);
    res.render(`userproduct/ownproduct`, { user: req.session.userauth, itemDatas: itemData, cart: req.session.cartitem, wishlist: req.session.wishlist });
})


/////////////////////////////////////////////Gets single item.

router.get("/checkout", async(req, res) => {
    let id = req.query.id;
    let userid = req.query.user_id;
    res.render(`product/customerdetails`, { userid: userid, id: id, user: req.session.userauth, cart: req.session.cartitem, wishlist: req.session.wishlist });
})

router.post("/thankyou", async(req, res) => {

    let userId = req.session.userauth.user_id
    let id = '';
    let priviouspurchage, itemData;
    if (req.body.id) {
        id = req.body.id;
        productUser_id = req.body.user_id;
        priviouspurchage = await users.addPurchaseItem(userId, id);
        await users.addSoldItem(productUser_id, id);
        itemData = await items.boughtItem(id);
        const viewCart = await users.showCartItem(userId)
        if (viewCart.length != 0) {
            const removeCartItem = await users.removeToCartItem(userId, id)
            cartitem = await items.findaddTocartItem(viewCart)
            req.session.cartitem = { cartlength: cartitem.length };
        }
    } else {
        id = await users.showCartItem(userId)
        itemData = await items.findMultipleItem(id);
        const soldItem = await users.addMultipleSoldItem(itemData);
        const priviouspurchage = await users.addMultiplePurchaseItem(req.session.userauth.user_id, id);
        itemData = await items.boughtMultiItem(id);
        id.map(async(i_id) => {
            const removeCartItem = await users.removeToCartItem(userId, i_id.toString())
        })
        req.session.cartitem = { cartlength: 0 };
    }
    res.render(`product/thankyou`, { user: req.session.userauth, cart: req.session.cartitem, wishlist: req.session.wishlist });

})

router.get("/soldItem", async(req, res) => {
    let userId = req.session.userauth.user_id
    const viewItemSold = await users.showPreviousSoldItem(userId)
    let itemData = await items.findPreviousSoldItem(viewItemSold);
    res.render(`userproduct/previoussold`, { user: req.session.userauth, itemDatas: itemData, cart: req.session.cartitem, wishlist: req.session.wishlist });
})

router.get("/purchased", async(req, res) => {
    let userId = req.session.userauth.user_id;
    let itemData = await users.showPreviousPurchaseItem(userId);
    const itemDatas = await items.getpurchageItem(itemData)
    const getcmt = await comments.getUserComment(userId);
    res.render(`userproduct/previouslypurchased`, { user: req.session.userauth, itemDatas: itemDatas, cart: req.session.cartitem, getcmt: getcmt, wishlist: req.session.wishlist });

})
router.get("/cart", async(req, res) => {
    let userId = req.session.userauth.user_id
    const viewCart = await users.showCartItem(userId)
    let sum = 0;
    let cartitem;
    if (viewCart != null) {
        cartitem = await items.findaddTocartItem(viewCart)
        req.session.cartitem = { cartlength: cartitem.length };
        cartitem.forEach((sumprice) => {
            sum = sumprice.itemPrice + sum;
        })
    }
    const addwishlist = await users.showWishlistItem(userId)
    if (addwishlist != null) {
        const wishitemiTem = await items.findaddTocartItem(addwishlist)
        req.session.wishlist = { cartlength: wishitemiTem.length };
    }
    res.render(`product/cart`, { user: req.session.userauth, grandTotal: sum, cart: req.session.cartitem, cartitem: cartitem, wishlist: req.session.wishlist });
})


router.get("/addtocart", async(req, res) => {
    let id = req.query.id;
    let userId = req.session.userauth.user_id
    const removewishitem = await users.removeToWishlistitem(userId, id)
    const addtocart = await users.addToCartitem(userId, id)
    res.redirect('/item/cart')
})

router.get("/wishlist", async(req, res) => {
    let userId = req.session.userauth.user_id
    let viewCart = await users.showWishlistItem(userId)
    if (viewCart == null) {
        viewCart = [];
    }
    const wishlistitem = await items.findaddTocartItem(viewCart)
    req.session.wishlist = { cartlength: wishlistitem.length };
    res.render(`product/wishlist`, { user: req.session.userauth, cart: req.session.cartitem, wishlistitem: wishlistitem, wishlist: req.session.wishlist });
})

router.get("/addwishlist", async(req, res) => {
    let id = req.query.id;
    let userId = req.session.userauth.user_id
    const addtocart = await users.addToWishlistitem(userId, id)
    res.redirect('/item/wishlist')
})


router.get("/addwishlistajax", async(req, res) => {
    let id = req.query.id;
    let userId = req.session.userauth.user_id
    const addtocart = await users.addToWishlistitem(userId, id)
    let viewCart = await users.showWishlistItem(userId)
    if (viewCart == null) {
        viewCart = [];
    }
    const wishlistitem = await items.findaddTocartItem(viewCart)
    res.json(wishlistitem.length);
})

router.get("/addreview", async(req, res) => {
    let user_id = req.query.id;
    let item_id = req.query.itemid;
    const checkcmt = await items.checkCmtOrnot(item_id);
    const getcmt = await comments.getItemCmt(checkcmt.commentIds)
    res.render(`product/addreview`, { user: req.session.userauth, userid: user_id, item_id: item_id, getcmt: getcmt.length, wishlist: req.session.wishlist });
})

router.post("/addreview", async(req, res) => {
    let userId = req.body.userid;
    let itemId = req.body.itemid;
    let content = req.body.contetnt;
    let rating = req.body.rating;
    const addcmt = await comments.createComment(userId, content, rating);
    const addcmtonItem = await items.addCommentToItem(addcmt._id.toString(), itemId)
    res.redirect('/item/purchased')
})

router.get("/review", async(req, res) => {
    let id = req.query.id;
    let name = req.query.name;
    const getcmt = await comments.getUserComment(id);
    let avgrate = 0;
    let avgnumber;
    console.log(getcmt);
    if (getcmt == 0) {
        avgnumber = 0;
    } else {
        getcmt.forEach((datas) => {

            avgrate = Number(datas.rating) + avgrate;
        })
        avgnumber = Number(avgrate / getcmt.length);
    }
    res.render(`product/itemreview`, { user: req.session.userauth, getcmt: getcmt, name: name, avgnumber: avgnumber, wishlist: req.session.wishlist });
})

router.get("/removewishlist", async(req, res) => {
    let id = req.query.id;
    let userId = req.session.userauth.user_id
    const removewishItem = await users.removeToWishlistitem(userId, id)
    res.redirect('/item/wishlist')
})

router.get("/removecartlist", async(req, res) => {
    let id = req.query.id;
    let userId = req.session.userauth.user_id
    const removewishItem = await users.removeToCartItem(userId, id)
    res.redirect('/item/cart')
})

module.exports = router;