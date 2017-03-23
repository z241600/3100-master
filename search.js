/**
 * Created by user on 23-Mar-17.
 */
module.exports = {

    advcacedSearch:function (res, targetName, priceRange, catalogId) {
        //lookup the target item in the db using priceRange and catalogId as parameter

        //return the itemId and other info if it exist

        //throw error:item not found and give Recommendation to user according to preference

        //update the user's preference with the item's catalog index or the catalogId if item is not found
    },

    simpleSearch: function (res,targetName) {
        //lookup the target item in the db and return the itemId and other info if it exist

        //throw error:item not found and give Recommendation to user according to preference

        //update the user's preference with the item's catalog index
    }
};