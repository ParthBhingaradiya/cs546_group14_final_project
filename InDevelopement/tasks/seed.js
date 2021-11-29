const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const items = data.items;

async function main() 
{
    const db = await dbConnection();
    await db.dropDatabase();
    let item1 = await items.createItem("Brown Trouser Pants", "Its brown pants and it is large", "Open", "h54etn5hn4n", 15, ["4574857389","75348573","ngjfdtuvfj"],["brownpants-xxl-jfhj","ghbdfncjf56-xxl-jpg"]);
    let item2 = await items.createItem("Red Shirt", "Its a red shirt and it is large", "Open", "hrvdmkcef", 12, ["56783567","fdbcnf","65yrfhde6"],["redshirt-xxl-jpg","redshirtback-xxl-jpg"])
    let id = item1._id.toString();
    let foundItem = await items.findItem(id);
    let boughtItem = await items.boughtItem(id);
    let allItems = await items.getItemList();
    let addedComment = await items.addCommentToItem("rchdfjcdfhjn",id);

    await db.serverConfig.close();

}
main();