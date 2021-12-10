const express = require('express');
const router = express.Router();
const data = require('../data');
const items = data.items;
const users = data.users;
const comments = data.comments;
const path = require('path');
const multer = require('multer');
const { checkUser } = require('../data/user');
/////////////////////////////////////////Gets list of items.

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/');
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage })
router.get("/additem", async (req, res) => {
    if (req.session.userauth) {
        res.render(`product/productdetails`, { user: req.session.userauth, wishlist: req.session.wishlist, cart: req.session.cartitem });
    } else {
        res.redirect('/login')
    }
})


router.post("/additem", upload.array('uploaded_file'), async (req, res) => {
    if (req.session.userauth) {
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
    } else {
        res.redirect('/login')
    }
})

router.get("/myitem", async (req, res) => {
    if (req.session.userauth) {
        let userId = req.session.userauth.user_id
        let itemData = await items.findUserItem(userId);
        res.render(`userproduct/ownproduct`, { user: req.session.userauth, itemDatas: itemData, cart: req.session.cartitem, wishlist: req.session.wishlist });
    } else {
        res.redirect('/login')
    }
})

router.post('/search', async (req, res) => {
    let searchTerm = req.body.searchItem;
    let itemData = await items.searchItem(searchTerm);
    res.render(`product/searchitem`, { user: req.session.userauth, itemDatas: itemData, cart: req.session.cartitem, wishlist: req.session.wishlist });
})
/////////////////////////////////////////////Gets single item.

router.get("/checkout", async (req, res) => {
    if (req.session.userauth) {
        let id = req.query.id;
        res.render(`product/customerdetails`, { id: id, user: req.session.userauth, cart: req.session.cartitem, wishlist: req.session.wishlist });
    } else {
        res.redirect('/login')
    }
})

router.post("/thankyou", async (req, res) => {
    if (req.session.userauth) {

        let userId = req.session.userauth.user_id
        let id = '';
        let priviouspurchage, itemData;
        if (req.body.id) {
            id = req.body.id;
            priviouspurchage = await users.addPurchaseItem(userId, id);
            itemData = await items.boughtItem(id);
        } else {
            id = await users.showCartItem(userId)
            priviouspurchage = await users.addMultiplePurchaseItem(userId, id);
            itemData = await items.boughtMultiItem(id);
        }
        res.render(`product/thankyou`, { user: req.session.userauth, cart: req.session.cartitem, wishlist: req.session.wishlist });
    } else {
        res.redirect('/login')
    }

})

router.get("/soldItem", async (req, res) => {
    if (req.session.userauth) {
        let userId = req.session.userauth.user_id
        let itemData = await items.getSoldItemList(userId);
        res.render(`userproduct/previoussold`, { user: req.session.userauth, itemDatas: itemData, cart: req.session.cartitem, wishlist: req.session.wishlist });
    } else {
        res.redirect('/login')
    }
})

router.get("/purchased", async (req, res) => {
    if (req.session.userauth) {
        let userId = req.session.userauth.user_id;
        let itemData = await users.showPreviousPurchaseItem(userId);
        const itemDatas = await items.getpurchageItem(itemData)
        const getcmt = await comments.getUserComment(userId);
        res.render(`userproduct/previouslypurchased`, { user: req.session.userauth, itemDatas: itemDatas, cart: req.session.cartitem, getcmt: getcmt, wishlist: req.session.wishlist });
    } else {
        res.redirect('/login')
    }

})
router.get("/cart", async (req, res) => {
    if (req.session.userauth) {
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
    } else {
        res.redirect('/login')
    }
})


router.get("/addtocart", async (req, res) => {
    if (req.session.userauth) {
        let id = req.query.id;
        let userId = req.session.userauth.user_id
        const removewishitem = await users.removeToWishlistitem(userId, id)
        const addtocart = await users.addToCartitem(userId, id)
        res.redirect('/item/cart')
    } else {
        res.redirect('/login')
    }
})

router.get("/wishlist", async (req, res) => {
    if (req.session.userauth) {
        let userId = req.session.userauth.user_id
        let viewCart = await users.showWishlistItem(userId)
        if (viewCart == null) {
            viewCart = [];
        }
        const wishlistitem = await items.findaddTocartItem(viewCart)
        req.session.wishlist = { cartlength: wishlistitem.length };
        res.render(`product/wishlist`, { user: req.session.userauth, cart: req.session.cartitem, wishlistitem: wishlistitem, wishlist: req.session.wishlist });
    } else {
        res.redirect('/login')
    }
})

router.get("/addwishlist", async (req, res) => {
    if (req.session.userauth) {
        let id = req.query.id;
        let userId = req.session.userauth.user_id
        const addtocart = await users.addToWishlistitem(userId, id)
        res.redirect('/item/wishlist')
    } else {
        res.redirect('/login')
    }
})


router.get("/addwishlistajax", async (req, res) => {
    if (req.session.userauth) {
        let id = req.query.id;
        let userId = req.session.userauth.user_id
        const addtocart = await users.addToWishlistitem(userId, id)
        let viewCart = await users.showWishlistItem(userId)
        if (viewCart == null) {
            viewCart = [];
        }
        const wishlistitem = await items.findaddTocartItem(viewCart)
        res.json(wishlistitem.length);
    } else {
        res.redirect('/login')
    }
})

router.get("/addreview", async (req, res) => {
    if (req.session.userauth) {
        let user_id = req.query.id;
        let item_id = req.query.itemid;
        const checkcmt = await items.checkCmtOrnot(item_id);
        const getcmt = await comments.getItemCmt(checkcmt.commentIds)
        res.render(`product/addreview`, { user: req.session.userauth, userid: user_id, item_id: item_id, getcmt: getcmt.length, wishlist: req.session.wishlist });
    } else {
        res.redirect('/login')
    }
})

router.post("/addreview", async (req, res) => {
    if (req.session.userauth) {
        let userId = req.body.userid;
        let itemId = req.body.itemid;
        let content = req.body.contetnt;
        let rating = req.body.rating;
        const addcmt = await comments.createComment(userId, content, rating);
        const addcmtonItem = items.addCommentToItem(addcmt._id.toString(), itemId)
        res.redirect('/item/purchased')
    } else {
        res.redirect('/login')
    }
})

router.get("/review", async (req, res) => {
    if (req.session.userauth) {
        let id = req.query.id;
        let name = req.query.name;
        const getcmt = await comments.getUserComment(id);
        let avgrate = 0;
        getcmt.forEach((datas) => {
            avgrate = Number(datas.rating) + avgrate;
        })
        let avgnumber = Number(avgrate / getcmt.length);
        res.render(`product/itemreview`, { user: req.session.userauth, getcmt: getcmt, name: name, avgnumber: avgnumber, wishlist: req.session.wishlist });
    } else {
        res.redirect('/login')
    }
})

router.get("/removewishlist", async (req, res) => {
    if (req.session.userauth) {
        let id = req.query.id;
        let userId = req.session.userauth.user_id
        const removewishItem = await users.removeToWishlistitem(userId, id)
        res.redirect('/item/wishlist')
    } else {
        res.redirect('/login')
    }
})

router.get("/removecartlist", async (req, res) => {
    if (req.session.userauth) {
        let id = req.query.id;
        let userId = req.session.userauth.user_id
        const removewishItem = await users.removeToCartItem(userId, id)
        res.redirect('/item/cart')
    } else {
        res.redirect('/login')
    }
})

module.exports = router;
