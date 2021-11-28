const express = require('express');
const router = express.Router();
const data = require('../data');
const itemData= data.items;
/////////////////////////////////////////Gets list of items.
router.get('/',async(req,res)=>{

})
/////////////////////////////////////////////Gets single item.
router.get('/:id',async(req,res)=>{

})
module.exports = router; 