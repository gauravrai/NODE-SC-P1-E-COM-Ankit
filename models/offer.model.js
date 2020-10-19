const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let OfferSchema = new Schema({
    name: {
        type: String
    },
    from: {
        type: Date
    },
    to: {
        type: Date
    },
    multipleOf: {
        type: Number
    },
    freeItem: {
        type: Number
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
    applyFor: {
        type: String
    },
    offerCategoryId: {
        type: Array
    },
    offerSubcategoryId: {
        type: Array
    },
    offerProductId: {
        type: Array
    },
    offerVarient: {
        type: String 
    },
    freeCategoryId: {
        type: ObjectId
    },
    freeSubcategoryId: {
        type: ObjectId
    },
    freeProductId: {
        type: ObjectId
    },
    freeVarient: {
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