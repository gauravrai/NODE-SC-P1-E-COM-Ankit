const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let IpAddressSchema = new Schema({
    brandId: {
        type: ObjectId,
    },
    ip: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    },
    deletedAt: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Export the model
module.exports = mongoose.model("Ip_Address", IpAddressSchema);