const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let CustomerSchema = new Schema({

    mobile: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
    },
    email: {
        type: String
    },
    gst: {
        type: String,
    },
    sameAsBillingAddress: {
        type: Boolean
    },
    billingAddress: {
        type: Object
    },
    shippingAddress: {
        type: Object
    },
    otp: {
        type: Number,
    },
    profileUpdated: {
        type: Boolean,
        default : false
    },
    token: {
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
module.exports = mongoose.model('customer', CustomerSchema);