const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const { boughtItem } = require('../data/items');
const { addPurchaseItem } = require('../data/user');
const items = data.items;
const users = data.users;
const reviews = data.comments;
///Note: Error when runs seed but involves with closing and still adds data
async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    //////////////////////////////////////////////////////////////////////////Creating users
    let secondUser = await users.createUser("Faraz","Pathan","fpathan@gmail.com","25 Amber Dr.","Fairlawn","07465","New Jersey","password123",20,"password123");
    let firstUser = await users.createUser("Banka", "Akancha", "abanka@stevens.com", "93 Western Avenue", "Jersey City", "07307", "New Jersey", "password123", 27,"password123");
    let thirdUser = await users.createUser("Parth","Bhingaradiya","pbhingaradiya@gmail.com","87 Florham Ave","Paterson","05943","New Jersey","password123",35,"password123" )
    let fourthUser = await users.createUser("Hiren","Lodaliya","hlodaliya@gmail.com","76 Lorty Park","Kooperville","75432","Delaware","password123",48,"password123" )
    let fifthUser = await users.createUser("Malhar","Paghdal","mpaghdal@gmail.com","345 East Ave","Los Angeles","98342","California","password123",16,"password123" )
    let sixthUser = await users.createUser("Ajman","Aha","ajman08@gmail.com","345 Park Place","Edison","98342","Texas","password123",23 ,"password123")
    let seventhUser = await users.createUser("Chance","Assia","chanceassia@gmail.com","38 Chamberline Dr.","Seaside","56435","Florida","password123",30,"password123" )
    let firstid = firstUser._id.toString();
    let secondid = secondUser._id.toString();
    let thirdid = thirdUser._id.toString();
    let fourthid = fourthUser._id.toString();
    let fifthid = fifthUser._id.toString();
    let sixthid = sixthUser._id.toString();
    let seventhid = seventhUser._id.toString();
    ////////////////////////////////////////////////////////////////////////Creating items
    let item1 = await items.createItem("Brown Trouser Pants", "Its brown pants and it is large.", "Open", firstid.toString(), 15, [], ["item1part1.jpeg","item1part2.jpeg","item1part3.jpeg"]);
    let item2 = await items.createItem("Red Shirt", "Its a red shirt and it is large.", "Open", firstid.toString(), 12, [], ["item2part1.jpeg","item2part2.jpeg","item2part3.jpeg"]);
    let item3 = await items.createItem("Black belt", "Its a black belt with a large size.", "Open", firstid.toString(), 26, [], ["item3part1.jpeg","item3part2.jpeg","item3part3.jpeg"]);
    let item4 = await items.createItem("White Shoes", "Its white shoes with size 13.", "Open", secondid.toString(), 11, [], ["item4part1.jpeg","item4part2.jpeg","item4part3.jpeg"]);
    let item5 = await items.createItem("Purple Scarf", "its purple scarf with a pattern.", "Open", secondid.toString(), 18, [], ["item5part1.jpeg","item5part2.jpeg","item5part3.jpeg"]);
    let item6 = await items.createItem("Black Gloves", "Black Gloves for a small hand.","Open", secondid.toString(), 25, [], ["item6part1.jpeg","item6part2.jpeg","item6part3.jpeg"]);
    let item7 = await items.createItem("Silver Necklace", "its a silver necklace with a pretty pandent.", "Open", thirdid.toString(), 85, [], ["item7part1.jpeg","item7part2.jpeg","item7part3.jpeg"]);
    let item8 = await items.createItem("Snake Ring", "Its a ring that looks like a snake.", "Open", thirdid.toString(), 4, [], ["item8part1.jpeg","item8part2.jpeg","item8part3.jpeg"]);
    let item9 = await items.createItem("Blue Jeans", "Its blue jeans that looks like its from the 90s.", "Open", thirdid.toString(), 42, [], ["item9part1.jpeg","item9part2.jpeg","item9part3.jpeg"]);
    let item10 = await items.createItem("Baseball Cap", "Its a old baseball cap from a baseball team.", "Open", fourthid.toString(), 9, [], ["item10part1.jpeg","item10part2.jpeg","item10part3.jpeg"]);
    let item11 = await items.createItem("Leather Jacket", "Leather Jacket with a cool sign in the back.", "Open", fourthid.toString(), 56, [], ["item11part1.jpeg","item11part2.jpeg","item11part3.jpeg"]);
    let item12 = await items.createItem("Jean Jacket", "Jean jacket with holes all around.", "Open", fourthid.toString(), 36, [], ["item12part1.jpeg","item12part2.jpeg","item12part3.jpeg"]);
    let item13 = await items.createItem("Dirty Socks", "Dirty Socks that I wanna get rid of.", "Open", fifthid.toString(), 1, [], ["item13part1.jpeg","item13part2.jpeg","item13part3.jpeg"]);
    let item14 = await items.createItem("Grey Sweatpants", "Grey Sweatpants that is cozy and soft.", "Open", fifthid.toString(), 18, [], ["item14part1.jpeg","item14part2.jpeg","item14part3.jpeg"]);
    let item15 = await items.createItem("Polo Shirt", "Polo shirt for casual wear.", "Open", fifthid.toString(), 25, [], ["item15part1.jpeg","item15part2.jpeg","item15part3.jpeg"]);
    let item16 = await items.createItem("Sunglasses", "Black sunglasses for the sun and look cool.", "Open", sixthid.toString(), 12, [], ["item16part1.jpeg","item16part2.jpeg","item16part3.jpeg"]);
    let item17 = await items.createItem("Basketball Jersey", "Great Jersey from a player and a rare find.", "Open", sixthid.toString(), 130, [], ["item17part1.jpeg","item17part2.jpeg","item17part3.jpeg"]);
    let item18 = await items.createItem("Baseball Jersey", "Baseball jersey is super clean and large.", "Open", sixthid.toString(), 110, [], ["item18part1.jpeg","item18part2.jpeg","item18part3.jpeg"]);
    let item19 = await items.createItem("Green Shirt", "Green shirt with a Large size.", "Open", seventhid.toString(), 32, [], ["item19part1.jpeg","item19part2.jpeg","item19part3.jpeg"]);
    let item20 = await items.createItem("Cool Bracelet", "It's a cool bracelet that is unique and hip.", "Open", seventhid.toString(), 45, [], ["item20part1.jpeg","item20part2.jpeg","item20part3.jpeg"]);
    let item21 = await items.createItem("Pretty Heels", "Heels is tall and size 10.", "Open", seventhid.toString(), 51, [], ["item21part1.jpeg","item21part2.jpeg","item21part3.jpeg"]);
    let item22 = await items.createItem("Unique Earrings", "Comes as a pair and very unique and makes every outfit look good.", "Open", seventhid.toString(), 4, [], ["item22part1.jpeg","item22part2.jpeg","item22part3.jpeg"]);
    let item23 = await items.createItem("Blue Sweatshirt", "Blue Sweatshirt that is a large size and cozy.", "Open", seventhid.toString(), 15, [], ["item23part1.jpeg","item23part2.jpeg","item23part3.jpeg"]);
    let item24 = await items.createItem("Black Beanie", "Black beanie that is cozy for the winter.", "Open", secondid.toString(), 3, [], ["item24part1.jpeg","item24part2.jpeg","item24part3.jpeg"]);
    let item25 = await items.createItem("Winter Coat", "Great winter coat for the winter and very stylish.", "Open", fourthid.toString(), 51, [], ["item25part1.jpeg","item25part2.jpeg","item25part3.jpeg"]);
    let item26 = await items.createItem("Pink Sweatshirt", "Great cozy and pretty for a everyday wear.", "Open", firstid.toString(), 26, [], ["item26part1.jpeg","item26part2.jpeg","item26part3.jpeg"]);
    let item27 = await items.createItem("Cozy Vest", "A vest that can make any out 10x better.", "Open", secondid.toString(), 14, [], ["item27part1.jpeg","item27part2.jpeg","item27part3.jpeg"]);
    let item28 = await items.createItem("Superman Shirt", "A superman shirt for true superman ship.", "Open", thirdid.toString(), 21, [], ["item28part1.jpeg","item28part2.jpeg","item28part3.jpeg"]);
    let item29 = await items.createItem("Brown Trenchcoat", "A classy trenchcoat for a cold and professional look.", "Open", fourthid.toString(), 76, [], ["item29part1.jpeg","item29part2.jpeg","item29part3.jpeg"]);
    let item30 = await items.createItem("Red Bandana", "Red bandana for an accessary on your to look cool.", "Open", fifthid.toString(), 4, [], ["item30part1.jpeg","item30part2.jpeg","item30part3.jpeg"]);
    let item31 = await items.createItem("Black Suit", "Great for a upcoming wedding or event and looks sharp.", "Open", sixthid.toString(), 123, [], ["item31part1.jpeg","item31part2.jpeg","item31part3.jpeg"]);
    let item32 = await items.createItem("Black Panjabi", "South Asian garment that is worn is traditional events.", "Open", seventhid.toString(), 72, [], ["item32part1.jpeg","item32part2.jpeg","item32part3.jpeg"]);
    let item1id = item1._id.toString();
    let item2id = item2._id.toString();
    let item3id = item3._id.toString();
    let item4id = item4._id.toString();
    let item5id = item5._id.toString();
    let item6id = item6._id.toString();
    let item7id = item7._id.toString();
    let item8id = item8._id.toString();
    let item9id = item9._id.toString();
    let item10id = item10._id.toString();
    let item11id = item11._id.toString();
    let item12id = item12._id.toString();
    let item13id = item13._id.toString();
    let item14id = item14._id.toString();
    let item15id = item15._id.toString();
    let item16id = item16._id.toString();
    let item17id = item17._id.toString();
    let item18id = item18._id.toString();
    let item19id = item19._id.toString();
    let item20id = item20._id.toString();
    let item21id = item21._id.toString();
    let item22id = item22._id.toString();
    let item23id = item23._id.toString();
    let item24id = item24._id.toString();
    let item25id = item25._id.toString();
    let item26id = item26._id.toString();
    let item27id = item27._id.toString();
    let item28id = item28._id.toString();
    let item29id = item29._id.toString();
    let item30id = item30._id.toString();
    let item31id = item31._id.toString();
    let item32id = item32._id.toString();
    /*await users.addToCartitem(firstid,item32id);
    await users.addToCartitem(secondid,item31id);
    await users.addToCartitem(thirdid,item30id);
    await users.addToCartitem(fourthid,item29id);
    await users.addToCartitem(fifthid,item28id);
    await users.addToCartitem(sixthid,item27id);
    await users.addToCartitem(seventhid,item26id);*/
    await users.addPurchaseItem(firstid,item32id)
    await users.addPurchaseItem(secondid,item31id)
    await users.addPurchaseItem(thirdid,item30id)
    await users.addPurchaseItem(fourthid,item29id)
    await users.addPurchaseItem(fifthid,item28id)
    await users.addPurchaseItem(sixthid,item27id)
    await users.addPurchaseItem(seventhid,item26id)
    await items.boughtItem(item32id);
    await items.boughtItem(item31id);
    await items.boughtItem(item30id);
    await items.boughtItem(item29id);
    await items.boughtItem(item28id);
    await items.boughtItem(item27id);
    await items.boughtItem(item26id);
    const comment1 = await reviews.createComment(firstid, "Wow great rating and would buy another one.", 4);
    const comment2 = await reviews.createComment(secondid, "Kinda disappointed and was not given the right information. Could be better.", 2);
    const comment3 = await reviews.createComment(thirdid, "Was not even given the item at all and owner did nothing to fix it.", 1);
    const comment4 = await reviews.createComment(fourthid, "Was great quality and came early and was a perfact fit.", 5);
    const comment5 = await reviews.createComment(fifthid, "Was a great product but shipped 2 weeks late and made me miss the birthday.", 3);
    const comment6 = await reviews.createComment(sixthid, "Came on time but after a few wash it shrunk and lost its purpose.", 3);
    const comment7 = await reviews.createComment(seventhid, "Great product and gave it to my girlfriend and she loved it. She wears it all the time.", 5);
    const addcmtonItem1 = await items.addCommentToItem(comment1._id.toString(), item32id);
    const addcmtonItem2 = await items.addCommentToItem(comment2._id.toString(), item31id);
    const addcmtonItem3 = await items.addCommentToItem(comment3._id.toString(), item30id);
    const addcmtonItem4 = await items.addCommentToItem(comment4._id.toString(), item29id);
    const addcmtonItem5 = await items.addCommentToItem(comment5._id.toString(), item28id);
    const addcmtonItem6 = await items.addCommentToItem(comment6._id.toString(), item27id);
    const addcmtonItem7 = await items.addCommentToItem(comment7._id.toString(), item26id);
    await users.addToCmt(item32.userId,comment1._id.toString())
    await users.addToCmt(item31.userId,comment2._id.toString())
    await users.addToCmt(item30.userId,comment3._id.toString())
    await users.addToCmt(item29.userId,comment4._id.toString())
    await users.addToCmt(item28.userId,comment5._id.toString())
    await users.addToCmt(item27.userId,comment6._id.toString())
    await users.addToCmt(item26.userId,comment7._id.toString())

    /////////////////////////////////////////////////////////testing items
    /*let foundItem = await items.findItem(item1id);
    try{
        await items.findItem();
    }
    catch(e)
    {
        console.log("find items wrong question is right")
    }

    //let boughtItem = await items.boughtItem(item1id);
    try{
        await items.boughtItem();
    }
    catch(e)
    {
        console.log("bought items wrong question is right")
    }
    let allItems = await items.getItemList();
    //let addedComment = await items.addCommentToItem("rchdfjcdfhjn", firstid);
    let firstLogin = await users.checkUser("abanka@stevens.com", "akanch@12345");
    try{
        await users.checkUser("abanka@stevens.com","akanch@1234")
    }
    catch(e){
        console.log("Check users wrong question is right")
    }
    let getUserExample = await users.getSingleUser(fourthid);
    try{
        await users.getSingleUser()
    }
    catch(e){
        console.log("get single user wrong question is right");
    }
    let addCartItem = await users.addToCartitem(fifthid,item21id);
    //wrong item = '61b1a8b0fcs8d2f9608370c7'
    //wrong user = '61b1a8x0fcf8d2f9608370b8'
    /*try{
        let addCartItemExample = await users.addToCartitem(fifthid,'61b1a8b0fcs8d2f9608370c7');
    }
    catch(e){
        console.log("add to cart items with wrong ids work")
    }*/
    //let addCartItem2 = await users.addToCartitem(sixthid,item21id);
    //await items.boughtItem(item21id);
    //let showCartItem= await users.showCartItem(fifthid);
    //console.log("Hey200000");
    /*let wishItem = await users.addToWishlistitem(secondid,item20id);
    let wishlist = await users.showWishlistItem(secondid);
    let addUserPrevSold = await users.adduserPrevSold(thirdid,item12id);
    let showUserPrevSold = await users.showPreviousSoldItem(thirdid);
    let addPurchaseSingleItem = await users.addPurchaseSingleItem(firstid,item5id);
    let addcartItem3 = await users.addToCartitem(seventhid,item19id);
    let addcartItem4 = await users.addToCartitem(seventhid,item17id);
    let deleteCartItem = await users.deleteItemfromCart(seventhid,item19id);
    let deleteWishList = await users.deleteItemfromWishlist(secondid,item20id);*/



    await db.serverConfig.close();

}
main();