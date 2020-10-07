const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let CartItemSchema = new Schema({
    cartId: {
        type: ObjectId
    },
    userId: {
        type: ObjectId
    },
    sessionId: {
        type: String
    },
    productId: {
        type: ObjectId
    },
    price:{
        type: Number
    },
    discountId:{
        type: ObjectId
    },
    offerId:{
        type: ObjectId
    },
    coupon:{
        type: String
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
module.exports = mongoose.model('Cart_Item', CartItemSchema);