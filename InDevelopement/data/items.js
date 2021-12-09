const { ObjectId } = require("bson");
const mongoCollections = require("../config/mongoCollections");
const userData = require("./user.js");
const items = mongoCollections.items;



async function createItem(itemName, itemDescription, status, userId, itemPrice, commentId, photos) {
    if (typeof itemName != "string") {
        throw "Error: Item name was not given or wrong type";
    }
    if (typeof itemDescription != "string") {
        throw "Error: Item does not have a description."
    }
    if (typeof status != "string") {
        throw "Error: Status of the item was not given"
    }
    if (status !== "Sold" && status !== "Open") {
        throw "Error: Status was not the given options."
    }
    //check using userId
    ////////////////////////////////////////////////////check if userid exists later on

    if (typeof userId != "string") {
        throw "Error: userId was not given or different type."
    }
    try{
        await userData.getSingleUser(userId);
    }
    catch(e)
    {
        throw "Error: user does not exist while adding item"
    }
    if (typeof itemPrice != "number") {
        throw "Error: Item price was not goven or different type."
    }
    if(itemPrice<0)
    {
        throw "Error: Price for the item cannot be a negative number."
    }
    if (!(Array.isArray(commentId))) {
        throw "Error: comment Ids is supoosed to have."
    }
    for (const i of commentId) {
        if (typeof i != "string") {
            throw "Error: Was not given string Ids."
        }
    }
    if (!(Array.isArray(photos))) {
        throw "Error: Was not given a array of photos."
    }
    ///////////////////////////////////Photos will be tricky
    for (const i of photos) {
        if (typeof i != "string") {
            throw "Error: Was not given an array of string of photos."
        }
    }
    const itemsCollection = await items();
    let postDate = new Date().toUTCString();
    let obj = {
        itemName: itemName,
        itemDescription: itemDescription,
        status: status,
        userId: userId,
        itemPrice: itemPrice,
        commentIds: commentId,
        photos: photos,
        postDate: postDate
    }
    const insertInfo = await itemsCollection.insertOne(obj);
    if (insertInfo.insertedCount === 0) {
        throw "Error: Did not insert right"
    }
    return obj;
}
/////////////////////////////////////////////////////Given an item id in a string form it will return the item object.
async function findItem(itemId) {
    if (typeof itemId != "string") {
        throw "Error: was not given the right ID for the item list"
    }
    try {
        parseId = ObjectId(itemId);
    } catch (e) {
        throw "Error: Confirmation if the id was valid error."
    }
    const itemsCollection = await items();
    const findInfo = await itemsCollection.findOne({ _id: parseId })
    if (findInfo == null) {
        throw "No item with that id."
    } else {
        return findInfo;
    }
}
///changes the status of them item being open to sold. 
////Go to office hours to check with this
async function boughtItem(itemId) {
    if (typeof itemId != "string") {
        throw "Error: was not given the right ID for the item list"
    }
    let parseId;
    try {
        parseId = ObjectId(itemId);
    } catch (e) {
        throw "Error: Confirmation if the id was valid error."
    }
    let item;
    try {
        item = await findItem(itemId)
    } catch (e) {
        throw "Error: the item does not exist."
    }
    const itemsCollection = await items();
    let obj = {
        itemName: item["itemName"],
        itemDescription: item["itemDescription"],
        status: "Sold",
        userId: item["userId"],
        itemPrice: item["itemPrice"],
        commentIds: item["commentIds"],
        photos: item["photos"],
        postDate: item["postDate"]
    }
    const updatedInfo = await itemsCollection.updateOne({ _id: parseId }, { $set: obj });
    if (updatedInfo.modifiedCount == 0) {
        throw "Error: Could not update anything."
    }
    return obj;


}
//Returns a list of items that have the status open
async function getItemList() {
    const itemCollection = await items();
    let itemList = [];
    const itemTotalList = await itemCollection.find({}).toArray();
    for (const i of itemTotalList) {
        if (i["status"] == "Open") {
            itemList.push(i);
            i["_id"] = i["_id"].toString();
        }


    }

    return itemList;
}
//Adds a comment to a specific item given the comment id and the item id. 
async function addCommentToItem(commentId, itemId) {
    if (typeof commentId != "string") {
        throw "Error: Commentid was not given or a proper type."
    }
    if (typeof itemId != "string") {
        throw "Error: Item id was not given or a proper type"
    }
    commentId = commentId.trim();
    itemId = itemId.trim();
    if (itemId.length <= 0) {
        throw "Error: only gave a empty string for the Item ID."
    }
    if (commentId.length <= 0) {
        throw "Error: only gave a empty string for the comment ID."
    }
    let item;
    try {
        item = await findItem(itemId);
    } catch (e) {
        throw "Error: Could not find the item in the list while adding a comment into the item."
    }
    let parseId;
    try {
        parseId = ObjectId(itemId);
    } catch (e) {
        "Error: item id could not be converted into object id."
    }
    let commentArray = item["commentIds"];
    commentArray.push(commentId);
    const itemsCollection = await items();
    let obj = {
        itemName: item["itemName"],
        itemDescription: item["itemDescription"],
        status: item["status"],
        userId: item["userId"],
        itemPrice: item["itemPrice"],
        commentIds: commentArray,
        photos: item["photos"],
        postDate: item["postDate"]
    }
    const updatedInfo = await itemsCollection.updateOne({ _id: parseId }, { $set: obj });
    if (updatedInfo.modifiedCount == 0) {
        throw "Error: Could not update anything."
    }
    return obj;

}

//Returns a list of items that are bought (Cart)
async function getCartItem() {
    const itemCollection = await items();
    let itemList = [];
    const itemTotalList = await itemCollection.find({}).toArray();
    for (const i of itemTotalList) {
        if (i["status"] == "Sold") {
            itemList.push(i);
            i["_id"] = i["_id"].toString();
        }
    }
    return itemList;
}

//get privouse sold item
async function getSoldItemList(userid) {
    const itemCollection = await items();
    let itemList = [];
    const itemTotalList = await itemCollection.find({ userId: userid }).toArray();
    for (const i of itemTotalList) {
        if (i["status"] == "Sold") {
            itemList.push(i);
            i["_id"] = i["_id"].toString();
        }


    }

    return itemList;
}

//find item based on user
async function findUserItem(user_id) {
    if (typeof user_id != "string") {
        throw "Error: was not given the right ID for the item list"
    }
    try {
        parseId = ObjectId(user_id);
    } catch (e) {
        throw "Error: Confirmation if the id was valid error."
    }
    const itemsCollection = await items();
    const findInfo = await itemsCollection.find({ userId: user_id }).toArray()
    if (findInfo == null) {
        throw "No item with that id."
    } else {
        return findInfo;
    }
}

async function searchItem(searchTerm) {
    if (typeof searchTerm != "string") {
        throw "Error: was not given the right ID for the item list"
    }

    const itemsCollection = await items();
    console.log(searchTerm)
    const findInfo = await itemsCollection.find({ itemName: new RegExp(searchTerm.toLowerCase()) }).toArray()
    if (findInfo == null) {
        throw "No item with that id."
    } else {
        return findInfo;
    }
}

module.exports = {
    createItem,
    findItem,
    boughtItem,
    getItemList,
    addCommentToItem,
    getCartItem,
    findUserItem,
    searchItem,
    getSoldItemList
};