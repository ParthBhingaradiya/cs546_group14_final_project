const collection = require('../config/mongoCollections');
const user = collection.users;
let { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 1; //////////////////////////////Change back to 16 later on

/*
Error trying to find itemData so could not test the following:
1. Error checking if the item exist in addCartitem
2.cannot test showCart item part where if it checks if status is open.
3. cannot test addpurchase item because it changes item to "sold"
4. Can't test prev sold or prev purhcase because apppurchase didnt work
5. add check so i can delete sold item in a wish item
*/
//to create a new user
//sign-up functionality
async function createUser(firstName, lastName, email, address, city, pincode, state, accountPassword, age, cm_password) {
    if (!firstName || !lastName || !email || !address || !city || !state || !pincode || !accountPassword || !age)
        throw ("One or more user details are missing. Enter again");

    if (typeof age != 'number')
        throw ("age should be a number");

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
    if (cm_password != accountPassword) throw ("password should be match");
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
    if (typeof userid !== "string") {
        throw "Error: The user id given is not a valid user id."
    }
    parseId = ObjectId(userid);
    const userCollection = await user();
    const found = await userCollection.findOne({ _id: parseId });
    if (!found) {
        throw "Error: The user cannot be found."
    }
    return found
}

async function addToCartitem(userid, itemid) {
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user."
    }
    if (typeof itemid != "string") {
        throw "Error: was not given the right ID for the item."
    }
    /*try{
        let p = await itemData.findItem(itemid);
    }
    catch(e)
    {
        throw "Error: Item does not exist."
    }*/
    const user1 = await getSingleUser(userid);
    const newlist = user1.cart;
    newlist.push(ObjectId(itemid));
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
        prevPurchase: user1.prevPurchase,
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

async function addToCmt(userid, cmtId) {
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    if (typeof cmtId != "string") {
        throw "Error: was not given the right ID for the item"
    }
    const user1 = await getSingleUser(userid);
    const newlist = user1.commentSeller;
    newlist.push(ObjectId(cmtId));
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
        prevPurchase: user1.prevPurchase,
        prevSold: user1.prevSold,
        commentSeller: newlist,
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


async function addToWishlistitem(userid, itemid) {
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    if (typeof itemid != "string") {
        throw "Error: was not given the right ID for the item"
    }
    const user1 = await getSingleUser(userid);
    const newlist = user1.wishlist;
    newlist.push(ObjectId(itemid));
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
        prevPurchase: user1.prevPurchase,
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
    const getusewishlength = await getSingleUser(userid);
    const userlength = getusewishlength.wishlist.length;
    return userlength;
}



//It will return array of item ids
async function showCartItem(userid) {
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    const user = await getSingleUser(userid);
    return user.cart;
}

//It will return array of item ids
async function showWishlistItem(userid) {
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    const user = await getSingleUser(userid);
    return user.wishlist;
}

//Call this function while user purchase some items, we are adding item id to prevPurchase array
async function addPurchaseItem(userid, itemid) {
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    if (typeof itemid != "string") {
        throw "Error: was not given the right ID for the item"
    }

    const user1 = await getSingleUser(userid);
    const newlist = user1.prevPurchase;
    newlist.push(ObjectId(itemid));
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
        prevPurchase: newlist,
        prevSold: user1.prevSold,
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

async function addMultiplePurchaseItem(userid, itemid) {
    const user1 = await getSingleUser(userid);
    let newlist = user1.prevPurchase;
    itemid.forEach(async(itemsIds) => {
        newlist.push(ObjectId(itemsIds.toString()));
    })
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
        prevPurchase: newlist,
        prevSold: user1.prevSold,
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

async function addSoldItem(userid, itemid) {
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    if (typeof itemid != "string") {
        throw "Error: was not given the right ID for the item"
    }

    const user1 = await getSingleUser(userid);
    const newlist = user1.prevSold;
    newlist.push(ObjectId(itemid));
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
        prevPurchase: user1.prevPurchase,
        prevSold: newlist,
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

async function addMultipleSoldItem(itemData) {
    let newlist
    let user1
    const userCollection = await user();
    itemData.forEach(async(itemsDatas) => {

        let userid = itemsDatas.userId;
        let itemid = itemsDatas._id
        user1 = await userCollection.find({ _id: ObjectId(userid) }).toArray();
        newlist = user1[0].prevSold;
    })
    itemData.forEach(async(itemsDatas) => {
        let userid = itemsDatas.userId;
        let itemid = itemsDatas._id
        user1 = await userCollection.find({ _id: ObjectId(userid) }).toArray();
        newlist.push(itemid);
        let parseId;

        parseId = ObjectId(userid);

        const doc = {
            firstName: user1[0].firstName,
            lastName: user1[0].lastName,
            email: user1[0].email,
            address: user1[0].address,
            city: user1[0].city,
            pincode: user1[0].pincode,
            state: user1[0].state,
            accountPassword: user1[0].accountPassword,
            age: user1[0].age,
            avgRating: user1[0].avgRating,
            prevPurchase: user1[0].prevPurchase,
            prevSold: newlist,
            commentSeller: user1[0].commentSeller,
            cart: user1[0].cart,
            wishlist: user1[0].wishlist
        }
        console.log(doc)

        const updatedInfo = await userCollection.updateOne({ _id: parseId }, { $set: doc });

    })

}


//It will return array of item ids of previous puschase item
async function showPreviousPurchaseItem(userid) {
    const user = await getSingleUser(userid);
    return user.prevPurchase;
}

async function showPreviousSoldItem(userid) {
    const user = await getSingleUser(userid);
    return user.prevSold;
}

async function removeToWishlistitem(userid, itemid) {
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    if (typeof itemid != "string") {
        throw "Error: was not given the right ID for the item"
    }
    const user1 = await getSingleUser(userid);
    const newlist = user1.wishlist;

    const customarray = [];
    newlist.forEach((dd) => {
        if (dd.toString() != itemid) {
            customarray.push(ObjectId(dd));
        }
    })
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
        prevPurchase: user1.prevPurchase,
        prevSold: user1.prevSold,
        commentSeller: user1.commentSeller,
        cart: user1.cart,
        wishlist: customarray
    }
    const userCollection = await user();

    const updatedInfo = await userCollection.updateOne({ _id: parseId }, { $set: doc });

    return "Added";
}


async function removeToCartItem(userid, itemid) {
    if (typeof userid != "string") {
        throw "Error: was not given the right ID for the user"
    }
    if (typeof itemid != "string") {
        throw "Error: was not given the right ID for the item"
    }
    const user1 = await getSingleUser(userid);
    const newlist = user1.cart;
    const customarray = [];
    newlist.forEach((dd) => {
        if (dd.toString() != itemid) {
            customarray.push(ObjectId(dd));
        }
    })
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
        prevPurchase: user1.prevPurchase,
        prevSold: user1.prevSold,
        commentSeller: user1.commentSeller,
        cart: customarray,
        wishlist: user1.wishlist
    }
    const userCollection = await user();

    const updatedInfo = await userCollection.updateOne({ _id: parseId }, { $set: doc });
    if (updatedInfo.modifiedCount == 0) {
        throw "Error: Could not update anything."
    }
    return "Added";
}

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
    addToCmt,
    addMultiplePurchaseItem,
    removeToWishlistitem,
    removeToCartItem,
    addMultipleSoldItem,
    addSoldItem,
    showPreviousSoldItem
};