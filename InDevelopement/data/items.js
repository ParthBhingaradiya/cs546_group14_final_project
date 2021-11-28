const { ObjectId } = require("bson");
const mongoCollections = require("../config/mongoCollections");
const items = mongoCollections.items;
//Given item values it will create an item and post it to the 
async function createItem(itemName,itemDescription, status, userId, itemPrice,commentId,photos)
{
    if(typeof itemName != "string")
    {
        throw "Error: Item name was not given or wrong type";
    }
    if(typeof itemDescription != "string")
    {
        throw "Error: Item does not have a description."
    }
    if(typeof status != "string")
    {
        throw "Error: Status of the item was not given"
    }
    if(status!== "Sold"&&status!=="Open")
    {
        throw "Error: Status was not the given options."
    }
    //check using userId
    ////////////////////////////////////////////////////check if userid exists later on
    if(typeof userId != "string")
    {
        throw "Error: userId was not given or different type."
    }
    if(typeof itemPrice != "number")
    {
        throw "Error: Item price was not goven or different type."
    }
    if(typeof commentId != "Array")
    {
        throw "Error: comment Ids is supoosed to have."
    }
    for(const i of commentId)
    {
        if(typeof i != "string")
        {
            throw "Error: Was not given string Ids."
        }
    }
    if(typeof photos != "array")
    {
        throw "Error: Was not given a array of photos."
    }
    for(const i of photos)
    {
        if(typeof i != "string")
        {
            throw "Error: Was not given an array of string of photos."
        }
    }
    let postDate = new Date().toUTCString();
    let obj = {
        itemName = itemName,
        itemDescription = itemDescription,
        status: status,
        userId: userId,
        itemPrice: itemPrice,
        commentIds: commentId,
        photos: photos,
        postDate : postDate
    }
    obj["_id"] = obj["_id"].toString();
    const insertInfo = await restaurantCollection.insertOne(obj);
    if (insertInfo.insertedCount === 0)
    {
        throw "Error: Did not insert right"
    }
    return obj;
}
async function findItem()