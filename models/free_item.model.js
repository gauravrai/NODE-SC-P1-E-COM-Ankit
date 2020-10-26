const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let FreeItemSchema = new Schema({
    odid: {
        type: String,
    },
    orderId: {
        type: ObjectId,
    },
    userId: {
        type: ObjectId
    },
    categoryId: {
        type: ObjectId
    },
    subcategoryId: {
        type: ObjectId
    },
    productId: {
        type: ObjectId
    },
    VarientId: {
        type: ObjectId,
    },
    price:{
        type: Number
    },
    quantity:{
        type: Number
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
module.exports = mongoose.model('Free_Item', FreeItemSchema);