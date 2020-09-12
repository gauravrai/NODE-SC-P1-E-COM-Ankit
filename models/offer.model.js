const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let OfferSchema = new Schema({
    name: {
        type: String
    },
    categoryId: {
        type: ObjectId
    },
    subcategoryId: {
        type: ObjectId
    },
    productId: {
        type: ObjectId
    },
    offerType: {
        type: String,
    },
    percentage: {
        type: String,
        default: 0
    },
    fixed: {
        type: String,
        default: 0
    },
    cartValue: {
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
    applyFor: {
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