const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
const constant = '../config/constant';

const { ORDER_STATUS } = constant;

let orderSchema = new Schema({
    customerId: {
        type: ObjectId,
    },
    orderId: {
        type: String,
    },
    subTotal: {
        type: Number,
    },
    cgst: {
        type: Number
    },
    sgst: {
        type: Number
    },
    igst: {
        type: Number
    },
    grandTotal: {
        type: Number
    },
    orderStatus: {
        type: String,
        enum: ORDER_STATUS
    },
    orderFrom: {
        type: String,
        enum: [ 'WEB', 'APP', 'ADMIN' ],
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