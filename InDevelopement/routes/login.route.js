const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get("/", async (req, res) => {
    res.render(`login/login`);
})

router.get("/registration", async (req, res) => {
    res.render(`login/registration`);
})


module.exports = router;