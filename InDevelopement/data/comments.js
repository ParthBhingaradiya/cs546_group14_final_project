const { MongoClient, ObjectID, ReadPreferenceMode } = require('mongodb');
const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;

// Note: 
// Pass only user ID which user has inserted comment
// And content of Comment which needs to pass
// Comment ID & Comment date will generate by function createComment
async function createComment(userId, Content) {
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
        Date: CommentDate
    }
    const insertInfo = await commentsCollection.insertOne(obj);
    if (insertInfo.insertedCount === 0) {
        throw "Error: Comment not inserted"
    }
    return obj;
}
module.exports = {
    createComment
};
