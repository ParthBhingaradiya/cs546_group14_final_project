const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
const multer = require('multer');
const items = data.items;


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



module.exports = router;