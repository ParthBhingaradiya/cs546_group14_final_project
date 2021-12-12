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

async function getUserComment(userid) {
    const commentCollection = await comments();
    const findInfo = await commentCollection.find({ userId: userid }).toArray();
    if (findInfo === null) {
        return 0;
    }
    return findInfo;
}

async function getItemCmt(cmtId) {
    const commentCollection = await comments();
    const findInfo = await commentCollection.find({
        _id: {
            $in: cmtId
        }
    }).toArray()

    if (findInfo == null) {
        throw "No item with that id."
    } else {
        return findInfo;
    }
}

//getting comment given the comment Id
async function getComment(commentId){
    const commentCollection=await comments();
    const findComment=await commentCollection.findOne({ CommentId: commentId});
    if(findComment== null)
        return 0;
    else
        return findComment;
}

module.exports = {
    createComment,
    getUserComment,
    getItemCmt,
    getComment
};
