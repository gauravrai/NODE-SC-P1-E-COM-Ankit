const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let DiscountSchema = new Schema({
    couponName: {
        type: String
    },
    couponNo: {
        type: String
    },
    couponUsesLimit: {
        type: Number
    },
    orderValue: {
        type: Number
    },
    noOfUses: {
        type: Number
    },
    offerType : {
        type: String
    },
    percentage: {
        type: Number,
        default: 0
    },
    fixed: {
        type: Number,
        default: 0
    },
    from: {
        type: Date
    },
    to: {
        type: Date
    },
    capping: {
        type: String
    },
    applyFor: {
        type: String
    },
    firstOrder: {
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
module.exports = mongoose.model('discount', DiscountSchema);