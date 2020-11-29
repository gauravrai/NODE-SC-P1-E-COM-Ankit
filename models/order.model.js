const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
var ObjectId = mongoose.Schema.Types.ObjectId;
const constant = '../config/constant';

const { ORDER_STATUS } = constant;
const { PAYMENT_STATUS } = constant;

let orderSchema = new Schema({
    userId: {
        type: ObjectId,
    },
    odid: {
        type: String,
    },
    grandTotal: {
        type: Number
    },
    subTotal: {
        type: Number
    },
    shippingPrice: {
        type: Number,
    },
    quantity:{
        type: Number
    },
    customerDetail:{
        type: Object
    },
    taxType:{
        type: Number //1 = cgst & sgst, 2 = igst
    },
    totalTax:{
        type: Number,
        default : 0
    },
    orderStatus: {
        type: String,
        enum: ORDER_STATUS
    },
    orderFrom: {
        type: String,
        enum: [ 'WEB', 'APP', 'ADMIN' ],
    },
    paymentStatus: {
        type: String,
        enum: PAYMENT_STATUS
    },
    paymentType: {
        type: String,
        enum: [ 'COD', '' ],
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
    storeId: {
        type: ObjectId,
    },
    timeSlot: {
        type: String,
    },
    receiverName: {
        type: String,
    },
    deliveryData: {
        type: String,
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
module.exports = mongoose.model('order', orderSchema);