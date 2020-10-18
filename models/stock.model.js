const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let StockSchema = new Schema({
    fromStoreId: {
        type: ObjectId
    },
    toStoreId: {
        type: ObjectId
    },
    productId: {
        type: ObjectId
    },
    varientId: {
        type: ObjectId
    },
    count: {
        type: Number,
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