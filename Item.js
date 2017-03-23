/**
 * Created by user on 23-Mar-17.
 */
module.exports = {

    createItem: function(res,itemName,catId,price,photoNum,itemDesc) {
        //create record in itemdb with these info plus the userId

        //return 1 for success or -1 for fail

    },
    BuyItem:function(ItemID,buyerID)
    {
        //Perform back-end tasks (such as modifying the Actifity Ind),
        //serve the paypal information to the buyer, and notifying the seller about the trade.
    },
    updateItem:function (ItemID,json) {
        //update the item's info, given the ID and the data needed in the JSON.

    }

};