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
////////////////////////////////////////////
router.post('/:id',async(req,res)=>{

})
////////////////////////////////////////////Take you to a form.
router.get('/newPost',async(req,res)=>{

})
///////////////////////////////////////////Post from the form
router.post('/newPost',async(req,res)=>{

})
module.exports = router; 