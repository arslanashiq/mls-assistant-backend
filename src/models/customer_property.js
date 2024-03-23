const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const _ = require("lodash");

const CustomerPropertySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    property_data: [{
        data: {
            type: Object,// Disable validation for this field
        },
    }]
}, { validateBeforeSave: false }); 

CustomerPropertySchema.plugin(timestamps);

CustomerPropertySchema.methods.toJSON = function () {
    const CustomerProperty = this;
    const CustomerPropertyObject = CustomerProperty.toObject();
    const CustomerPropertyJson = _.pick(CustomerPropertyObject, [
        "_id",
        "user_id",
        "property_data",
        "createdAt",
        "updatedAt",
    ]);
    return CustomerPropertyJson;
};

const customer_property = mongoose.model("CustomerProperty", CustomerPropertySchema);
exports.customer_property = customer_property;
