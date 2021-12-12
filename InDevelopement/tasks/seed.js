const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const { boughtItem } = require('../data/items');
const items = data.items;
const users = data.users;

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    //////////////////////////////////////////////////////////////////////////Creating users
    let secondUser = await users.createUser("Faraz","Pathan","fpathan@gmail.com","25 Amber Dr.","Fairlawn","07465","New Jersey","portableb",20,"portableb");
    let firstUser = await users.createUser("Banka", "Akancha", "abanka@stevens.com", "93 Western Avenue", "Jersey City", "07307", "New Jersey", "akanch@12345", 27,"akanch@12345");
    let thirdUser = await users.createUser("Nabid","Kabir","nkabir@gmail.com","87 Florham Ave","Paterson","05943","New Jersey","vjrefdvjfn",35,"vjrefdvjfn" )
    let fourthUser = await users.createUser("Romy","Swardin","Swardin@gmail.com","76 Lorty Park","Kooperville","75432","Delaware","hfvnfhsdcnfv",48,"hfvnfhsdcnfv" )
    let fifthUser = await users.createUser("Alvi","Jami","ajami22@gmail.com","345 East Ave","Los Angeles","98342","California","fhvbhsdfcn",16,"fhvbhsdfcn" )
    let sixthUser = await users.createUser("Ajman","Aha","ajman08@gmail.com","345 Park Place","Edison","98342","Texas","hvghfbcnd34",23 ,"hvghfbcnd34")
    let seventhUser = await users.createUser("Chance","Assia","chanceassia@gmail.com","38 Chamberline Dr.","Seaside","56435","Florida","vnfdchfd",30,"vnfdchfd" )
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