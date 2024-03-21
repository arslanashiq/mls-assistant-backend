const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const _ = require("lodash");

const CustomerSearchHistorySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    search_data: []
});

CustomerSearchHistorySchema.plugin(timestamps);

CustomerSearchHistorySchema.methods.toJSON = function () {
    const CustomerSearchHistory = this;
    const CustomerSearchHistoryObject = CustomerSearchHistory.toObject();
    const CustomerSearchHistoryJson = _.pick(CustomerSearchHistoryObject, [
        "_id",
        "user_id",
        "search_data",
        "createdAt",
        "updatedAt",
    ]);
    return CustomerSearchHistoryJson;
};

const customer_search_history = mongoose.model("CustomerSearchHistory", CustomerSearchHistorySchema);
exports.customer_search_history = customer_search_history;
