const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
var ObjectId = mongoose.Schema.Types.ObjectId;
const constant = '../config/constant';

const { PAYMENT_STATUS } = constant;

let transationSchema = new Schema({
    userId: {
        type: ObjectId,
    },
    odid: {
        type: String,
    },
    receiptNo: {
        type: String,
    },
    totalAmount: {
        type: Number
    },
    paymentStatus: {
        type: String,
        enum: PAYMENT_STATUS
    },
    razorpayOrderId: {
        type: String,
    },
    razorpayPaymentId: {
        type: String,
    },
    razorpayResponse: {
        type: Object,
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
module.exports = mongoose.model('transation', transationSchema);