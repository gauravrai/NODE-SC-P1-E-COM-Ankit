const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
var ObjectId = mongoose.Schema.Types.ObjectId;

let CartSchema = new Schema({
    userId: {
        type: ObjectId
    },
    sessionId: {
        type: String
    },
    grandTotal: {
        type: Number
    },
    quantity:{
        type: Number
    },
    couponId: {
        type: ObjectId,
    },
    couponNo: {
        type: String,
    },
    couponAmount: {
        type: Number,
    },
    taxType:{
        type: Number //1 = cgst & sgst, 2 = igst
    },
    totalTax:{
        type: Number,
        default : 0
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
module.exports = mongoose.model('cart', CartSchema);