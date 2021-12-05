const express = require('express');
const router = express.Router();


router.get("/", async(req, res) => {
    res.render(`product/allproduct`);
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