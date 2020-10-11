const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let CartSchema = new Schema({
    userId: {
        type: ObjectId
    },
    sessionId: {
        type: String
    },
    grandTotal: {
        type: Number
    },
    shippingPrice: {
        type: Number,
    },
    quantity:{
        type: Number
    },
    customerDetail:{
        type: Object
    },
    address: {
        type: String
    },
    pincode:{
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
module.exports = mongoose.model('cart', CartSchema);