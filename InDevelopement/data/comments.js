const { MongoClient, ObjectID, ReadPreferenceMode } = require('mongodb');
const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const itemData = require("./items.js");

// Note: 
// Pass only user ID which user has inserted comment
// And content of Comment which needs to pass
// Comment ID & Comment date will generated by the function createComment
async function createComment(userId, Content, rating) {
    if (typeof userId !== 'string')
        throw 'UserId should be string';
    if (typeof Content !== 'string')
        throw 'Content should be string';

    const commentsCollection = await comments();
    var CommentId = (new ObjectID).toString();
    let CommentDate = new Date().toUTCString();

    let obj = {
        CommentId: CommentId,
        userId: userId,
        Content: Content,
        rating: rating,
        Date: CommentDate
    }
    const insertInfo = await commentsCollection.insertOne(obj);
    if (insertInfo.insertedCount === 0) {
        throw "Error: Comment not inserted"
    }
    //////Calls user to add the comment id to the user database
    return obj;
}
async function getComment(commentsId) {
    if (typeof commentsId !== 'string') {
        throw "Error: Comment Id should be string"
    }
    const commentCollection = await comments();
    try {
        parseId = ObjectId(commentsId);
    }
    catch (e) {
        throw "Error: Confirmation if the id was valid error."
    }
    const findInfo = await commentCollection.findOne({ _id: parseId })
    if (findInfo === null) {
        throw "Error: Can't find the item."
    }
    return findInfo;
}

async function getUserComment(userid) {
    const commentCollection = await comments();
    const findInfo = await commentCollection.find({ userId: userid }).toArray();
    if (findInfo === null) {
        throw "Error: Can't find the item."
    }
    return findInfo;
}
module.exports = {
    createComment,
    getComment,
    getUserComment
};
