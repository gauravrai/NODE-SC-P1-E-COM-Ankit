const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let orderSchema = new Schema({
    orderId: {
        type: String,
    },
    productId: {
        type: ObjectId,
    },
    variantId: {
        type: ObjectId,
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number
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
module.exports = mongoose.model('Order_Detail', orderSchema);