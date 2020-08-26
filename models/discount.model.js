const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let DiscountSchema = new Schema({
    coupon_no: {
        type: String
    },
    min_Order_gst: {
        type: String
    },
    no_of_uses: {
        type: String
    },
    name: {
        type: String
    },
    offer_type : {
        type: String
    },
    percentage: {
        type: String,
        default: null
    },
    fixed: {
        type: String,
        default: null
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
    apply_for: {
        type: String
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