const collection = require('../config/mongoCollections');
const data = require('../data');
const itemData= data.items;
const user = collection.users;
let { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 16;

//to create a new user
//sign-up functionality
async function createUser(firstName, lastName, email, address, city, pincode, state, accountPassword, age) {
    if (!firstName || !lastName || !email || !address || !city || !state || !pincode || !accountPassword || !age)
        throw ("One or more user details are missing. Enter again");

    if (typeof age != 'number')
        throw ("age should be a number");
    if(age<13&&age>140)
    {
        throw "Error: age cannot be too low or too high"
    }

    if (typeof firstName != 'string' || typeof lastName != 'string' || typeof email != 'string' || typeof address != 'string' || typeof city != 'string' || typeof pincode != 'string' || typeof state != 'string' || typeof accountPassword != 'string')
        throw ("One or more user information is of wrong type. Enter again.");

    if (!firstName.trim().length || !lastName.trim().length || !email.trim().length || !address.trim().length || !city.trim().length || !pincode.trim().length || !state.trim().length || !accountPassword.trim().length)
        throw ("One of more user information is only empty spaces. Enter again.");


    //should we be validating email address by sending a verification email
    //or just the format validation is enough
    //adding a simple regex email format validation for now

    var format = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!format.test(email))
        throw ("Invalid email format. Enter again");

    //check if email already exists
    const userCollection = await user();
    const found = await userCollection.findOne({ email: email.toLowerCase() });
    if (found != null)
        throw ("Email already exists.Log in");

    if (accountPassword.length < 6)
        throw ("password should be at-least 6 characters long");

    if (!accountPassword.trim().length || accountPassword.trim().length < accountPassword.length)
        throw ("password should not contain empty spaces");

    //error checks for pincode
    //should atleast be length 6, no characters/special characters (only numbers)

    var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    if (!isValidZip.test(pincode))
        throw ("Pincode if invalid.Enter again");

    const hash = await bcrypt.hash(accountPassword, saltRounds);
    const doc = {
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        address: address,
        city: city,
        pincode: pincode,
        state: state,
        accountPassword: hash,
        age: age,
        avgRating: 0,
        prevPurchase: new Array(),
        prevSold: new Array(),
        commentSeller: new Array(),
        cart: new Array(),
        wishlist: new Array()
    }
    await userCollection.insertOne(doc);
    const newUser = await userCollection.findOne(doc);
    newUser._id = newUser._id.toString();
    return newUser;
}

//searching a user with their email and accountPassword
//log-in functionality

async function checkUser(email, accountPassword) {
    if (!email || !accountPassword)
        throw ("Enter a username or password");

    if (typeof email != 'string' || !email.trim().length)
        throw ("username is not a valid string");

    if (email.trim().length < email.length)
        throw ("username cannot contain empty spaces");

    var format = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!format.test(email))
        throw ("Invalid email format. Enter again");

    if (accountPassword.length < 6)
        throw ("password should be at-least 6 characters long");

    if (!accountPassword.trim().length || accountPassword.trim().length < accountPassword.length)
        throw ("password should not contain empty spaces");

    const userCollection = await user();
    const found = await userCollection.findOne({ email: email.toLowerCase() });

    // console.log(found);
    if (!found)
        throw ("Either the username or password is invalid");
    else {
        //let authenticate=new Object();
        const hashPassword = found.accountPassword;
        let comparePassword = false;
        comparePassword = await bcrypt.compare(accountPassword, hashPassword);
        if (comparePassword == false)
            throw ("Either the username or password is invalid");
        else {
            return found;
        }
    }
}

async function getSingleUser(userid) {
    parseId = ObjectId(userid);
    const userCollection = await user();
    const found = await userCollection.findOne({ _id: parseId });
    return found
}

async function addToCartitem(userid, itemid){
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    if (typeof itemid != "string") {
        throw "Error: was not given the right ID for the item"
    }
    const user1 = await getSingleUser(userid);
    const newlist = user1.cart;
    newlist.push(itemid);
    let parseId;
    try {
        parseId = ObjectId(userid);
    } catch (e) {
        "Error: item id could not be converted into object id."
    }
    const doc = {
        firstName: user1.firstName,
        lastName: user1.lastName,
        email: user1.email,
        address: user1.address,
        city: user1.city,
        pincode: user1.pincode,
        state: user1.state,
        accountPassword: user1.accountPassword,
        age: user1.age,
        avgRating: user1.avgRating,
        prevPurchase:user1.prevPurchase,
        prevSold: user1.prevSold,
        commentSeller: user1.commentSeller,
        cart: newlist,
        wishlist: user1.wishlist
    }
    const userCollection = await user();

    const updatedInfo = await userCollection.updateOne({ _id: parseId }, { $set: doc });
    if (updatedInfo.modifiedCount == 0) {
        throw "Error: Could not update anything."
    }
    return "Added";
}

async function addToWishlistitem(userid, itemid){
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    if (typeof itemid != "string") {
        throw "Error: was not given the right ID for the item"
    }
    const user1 = await getSingleUser(userid);
    const newlist = user1.wishlist;
    newlist.push(itemid);
    let parseId;
    try {
        parseId = ObjectId(userid);
    } catch (e) {
        "Error: item id could not be converted into object id."
    }
    const doc = {
        firstName: user1.firstName,
        lastName: user1.lastName,
        email: user1.email,
        address: user1.address,
        city: user1.city,
        pincode: user1.pincode,
        state: user1.state,
        accountPassword: user1.accountPassword,
        age: user1.age,
        avgRating: user1.avgRating,
        prevPurchase:user1.prevPurchase,
        prevSold: user1.prevSold,
        commentSeller: user1.commentSeller,
        cart: user1.cart,
        wishlist: newlist
    }
    const userCollection = await user();

    const updatedInfo = await userCollection.updateOne({ _id: parseId }, { $set: doc });
    if (updatedInfo.modifiedCount == 0) {
        throw "Error: Could not update anything."
    }
    return "Added";
}

//It will return array of item ids
async function showCartItem(userid){
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    const user = await getSingleUser(userid);
    let i = [];
    for (const f of user.cart)
    {
        let item = itemData.findItem(f)
        if(item["status"]==="Open")
        {
            i.push(f._id);
        }
    }
    return i;
}

//It will return array of item ids
async function showWishlistItem(userid){
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    const user = await getSingleUser(userid);
    return user.wishlist;
}
/////////////////////////////Should i call item buy item here or should i do it with a cart so you would'nt have to call it multiple times 
//Call this function while user purchase some items, we are adding item id to prevPurchase array
async function addPurchaseItem(userid){
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    
    const user1 = await getSingleUser(userid);
    for(const i of user1.cart)
    {
        await itemData.boughtItem(i);
        item =await itemData.findItem(i);
        await itemData.adduserPrevSold(item.userId,i);
    }
    const newlist = user1.prevPurchase;
    //newlist.push(itemid);
    let newPrev = newlist.concat(user1.cart);
    let parseId;
    try {
        parseId = ObjectId(userid);
    } catch (e) {
        "Error: item id could not be converted into object id."
    }
    const doc = {
        firstName: user1.firstName,
        lastName: user1.lastName,
        email: user1.email,
        address: user1.address,
        city: user1.city,
        pincode: user1.pincode,
        state: user1.state,
        accountPassword: user1.accountPassword,
        age: user1.age,
        avgRating: user1.avgRating,
        prevPurchase:newPrev,
        prevSold: user1.prevSold,
        commentSeller: user1.commentSeller,
        cart: [],
        wishlist: user1.wishlist
    }
    const userCollection = await user();

    const updatedInfo = await userCollection.updateOne({ _id: parseId }, { $set: doc });
    if (updatedInfo.modifiedCount == 0) {
        throw "Error: Could not update anything."
    }
    return "Added";
}
//It will return array of item ids of previous puschase item
async function showPreviousPurchaseItem(userid){
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    const user = await getSingleUser(userid);
    return user.prevPurchase;
}
async function showPreviousSoldItem(userid){
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    const user = await getSingleUser(userid);
    return user.prevSold;
}
async function adduserPrevSold(userId,itemId)
{
    if(typeof userId != "string")
    {
        throw "Error: type of user id is not string or not given as a userprev sold"
    }
    if(typeof itemId != "string")
    {
        throw "Error: type of item id is not string or not given as a userprev sold"
    }
    const user1 = await getSingleUser(userid);
    let newPrevSold = user.prevSold;
    newPrevSold.push(itemId);
    let parseId;
    try {
        parseId = ObjectId(userid);
    } catch (e) {
        "Error: item id could not be converted into object id."
    }
    const doc = {
        firstName: user1.firstName,
        lastName: user1.lastName,
        email: user1.email,
        address: user1.address,
        city: user1.city,
        pincode: user1.pincode,
        state: user1.state,
        accountPassword: user1.accountPassword,
        age: user1.age,
        avgRating: user1.avgRating,
        prevPurchase:user1.prevPurchase,
        prevSold: newPrevSold,
        commentSeller: user1.commentSeller,
        cart: user1.cart,
        wishlist: user1.wishlist
    }

    const userCollection = await user();

    const updatedInfo = await userCollection.updateOne({ _id: parseId }, { $set: doc });
    if (updatedInfo.modifiedCount == 0) {
        throw "Error: Could not update anything."
    }
    return "Added";
    
}
/*async function deleteItemfromCart(userid, itemId)
{
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    if (typeof itemId != "string")
    {
        throw "Error: was not given the right Id type for the item"
    }
    const user1 = await getSingleUser(userid);
    
    
}*/
module.exports = {
    createUser,
    checkUser,
    getSingleUser,
    addToCartitem,
    addToWishlistitem,
    showCartItem,
    showWishlistItem,
    addPurchaseItem,
    showPreviousPurchaseItem,
    adduserPrevSold,
    showPreviousSoldItem

};
