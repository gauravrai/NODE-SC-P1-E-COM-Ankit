const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let RequestProductSchema = new Schema({
    userId: {
        type: ObjectId
    },
    productId: {
        type: ObjectId
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String
    },
    pincode: {
        type: String
    },
    description: {
        type: String
    },
    isReplied: {
        type: Boolean,
        default : false
    },
    status: {
        type: Boolean,
        default : true
    },
    deletedAt: {
        type: Number,
        default : 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Export the model
module.exports = mongoose.model('Request_Product', RequestProductSchema);