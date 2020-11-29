const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
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
    varientId: {
        type: ObjectId
    },
    price:{
        type: Number,
        default : 0
    },
    totalPrice:{
        type: Number,
        default : 0
    },
    offerId:{
        type: ObjectId
    },
    quantity:{
        type: Number,
        default : 0
    },
    taxType:{
        type: Number //1 = cgst & sgst, 2 = igst
    },
    tax:{
        type: Number, //tax percent based on taxType
        default : 0
    },
    cgst:{
        type: Number,
        default : 0 //cgst tax amount
    },
    sgst:{
        type: Number,
        default : 0 //sgst tax amount
    },
    igst:{
        type: Number,
        default : 0 //igst tax amount
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