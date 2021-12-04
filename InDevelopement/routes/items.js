const express = require('express');
const router = express.Router();
const data = require('../data');
const itemData= data.items;
const commentData = data.comment;
/////////////////////////////////////////////////check for negative numbers for numbers and trim
///////////////////////////////////////////use that one thing to check for the html inputs security wise
/////////////////////////////////////////Gets list of items that is open.
router.get('/',async(req,res)=>{
let listofItem = await itemData.getItemList();
///////////////////////////////////////////////////////////////////////////////////////////////////////Enter handlebars file 
//res.status(500).render('',{itemList:listofItem} )
})
/////////////////////////////////////////////Gets single item.
router.get('/:id',async(req,res)=>{
    let id = req.params.id
    let result;
    try{
        result = await itemData.findItem(req.params.id)
    }
    catch(e)
    {
        //res.status(400).render('ErrorPAge',{error: 'Error: Not a valid ID for the item'})
        res.status(400).json({Message:"Error: Not a valid ID for the item"});
    }
    //res.status(500).render('itempage',{item:result});
    res.status(500).json(result)
    

})
////////////////////////////////////////////
router.post('/newPost',async(req,res)=>{
    let itemName = req.body.itemName;
    let itemDescription = req.body.itemDescription;
    let status = req.body.status;
    let userId = req.body.userId;
    let itemPrice = req.body.itemPrice;
    let commentId = req.body.commentId;
    let photos = req.body.photos;
    if(typeof itemName != "string")
    {
        //res.status(400).render("ErrorPage",{error:"Error: Item name was not given or wrong type"});
        res.status(400).json({Message:"Error: Item name was not given or wrong type"});
    }
    if(typeof itemDescription != "string")
    {
        //res.status(400).render("ErrorPage", {error:"Error: Item does not have a description."})
        res.status(400).json({Message:"Error: Item does not have a description."});
    }
    if(typeof status != "string")
    {
        //res.status(400).render("ErrorPage",{error:"Error: Status of the item was not given"})
        res.status(400).json({Message:"Error: Status of the item was not given"});
    }
    if(status!== "Sold"&&status!=="Open")
    {
        //res.status(400).render"ErrorPage",{error: "Error: Status was not the given options."})
        res.status(400).json({Message:"Error: Status was not the given options."});
    }
    //check using userId
    ////////////////////////////////////////////////////check if userid exists later on
    if(typeof userId != "string")
    {
         //res.status(400).render("ErrorPage",{error:"Error: userId was not given or different type."})
         res.status(400).json({Message:"Error: userId was not given or different type."});
    }
    try{
        parseId = ObjectId(itemId);
    }
    catch(e)
    {
        //res.status(400).render("Errorpage",{error:"Error: Confirmation if the id was valid error for the item."})
        res.status(400).json({Message:"Error: Confirmation if the id was valid error for the item."});
    }
    if(typeof itemPrice != "number")
    {
        //res.status(400).render("Errorpage",{error:"Error: Item price was not goven or different type."})
        res.status(400).json({Message:"Error: Item price was not goven or different type."});
    }
    if(!(Array.isArray(commentId)))
    {
        //res.status(400).render("ErrorPage",{error: "Error: comment Ids is supoosed to have."})
        res.status(400).json({Message:"Error: comment Ids is supoosed to have."});
    }
    for(const i of commentId)
    {
        if(typeof i != "string")
        {
            //res.status(400).render("ErrorPage",{error: "Error: Was not given string Ids."})
            res.status(400).json({Message:"Error: Was not given string Ids."});
        }
        try{
            parseId = ObjectId(commentId);
        }
        catch(e)
        {
            //res.status(400).render("Errorpage",{error:"Error: Confirmation if the id was valid error for comments."})
            res.status(400).json({Message:"Error: Confirmation if the id was valid error for comments."});
        }
    }
    if(!(Array.isArray(photos)))
    {
        //res.status(400).render("Errorpage",{error:"Error: Was not given a array of photos."})
        res.status(400).json({Message:"Error: Was not given a array of photos."});
    }
    ///////////////////////////////////Photos will be tricky
    for(const i of photos)
    {
        if(typeof i != "string")
        {
            //res.status(400).render('Errorpage',{error:"Error: Was not given an array of string of photos."})
            res.status(400).json({Message:"Error: Was not given an array of string of photos."});
        }
    }
    itemData.createItem(itemName,itemDescription,status,userId,itemPrice,commentId,photos)
    res.redirect("/");
})
////////////////////////////////////////////Take you to a form.
router.get('/newPost',async(req,res)=>{
//res.status(500).render("newPageForm")
res.status(500).json({Message:"Success"});
})
///////////////////////////////////////////Post from the form for comment/q&a
router.post('/:id',async(req,res)=>{

})
module.exports = router; 