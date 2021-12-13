const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
const multer = require('multer');
const items = data.items;
const xxs = require('xss');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/img/');
    },

    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage })

router.get("/", async(req, res) => {
    if (req.session.userauth) {
        res.render(`product/productdetails`, { user: req.session.userauth });
    } else {
        res.redirect('/login')
    }
})

router.post("/", upload.array('uploaded_file'), async(req, res) => {


    try {
        let itemName = xxs(req.body.itemName);
        let description = xxs(req.body.description);
        let status = xxs(req.body.status);
        let itemPrice = Number(xxs(req.body.itemPrice));
        let photos = xxs(req.files.uploaded_file);
        let userId = xxs(req.session.userauth.user_id);
        let fileName = req.files.map((f_name) => {
            return f_name.originalname
        })
        let commentId = []
        if(typeof itemName !=="string"&&typeof description !=="string"&&typeof status !=="string")
        {
           throw "Error: Input was given non stirng."
        }
        if(itemPrice<0)
        {
            throw "Error: Price cannot be negative."
        }
        if(status!=="Open"&&status!=="Sold")
        {
            throw "Error: Status can only be Sold or Open."
        }
        if(!Array.isArray(fileName))
        {
            throw "Error: photos should be an array."
        }
        
        const additem = await items.createItem(itemName, description, status, userId, itemPrice, commentId, fileName)
        res.redirect(`/`);
    } catch (e) {
        console.log(e, 'test');
        res.redirect(`/additem`, { err: e });
    }
})



module.exports = router;