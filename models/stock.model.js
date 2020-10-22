const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let StockSchema = new Schema({

    count: {
        type: Number,
    },
    productId: {
        type: ObjectId
    },
    variant: {
        type: String,
        enum: ['ml', 'gram', 'kg'],
    },
    storeId: {
        type: ObjectId,
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
module.exports = mongoose.model('stock', StockSchema);