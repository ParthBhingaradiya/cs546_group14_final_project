const collection = require('../config/mongoCollections');
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
module.exports = {
    createUser,
    checkUser,
    getSingleUser
};