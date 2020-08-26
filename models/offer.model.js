const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let OfferSchema = new Schema({
    name: {
        type: String
    },
    cate_id: {
        type: ObjectId
    },
    s_cate_id: {
        type: ObjectId
    },
    product_id: {
        type: ObjectId
    },
    offer_type: {
        type: String,
    },
    percentage: {
        type: String,
        default: null
    },
    fixed: {
        type: String,
        default: null
    },
    minimum_cart_value: {
        type: String 
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
module.exports = mongoose.model('offer', OfferSchema);