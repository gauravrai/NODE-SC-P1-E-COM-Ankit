const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let RejectSchema = new Schema({
    orderDetailId: {
        type: ObjectId,
    },
    userId: {
        type: ObjectId,
    },
    odid: {
        type: String,
    },
    productId: {
        type: ObjectId
    },
    varientId: {
        type: ObjectId
    },
    price:{
        type: Number
    },
    totalPrice:{
        type: Number
    },
    offerId:{
        type: ObjectId
    },
    offerProduct:{
        type: Object
    },
    quantity:{
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
module.exports = mongoose.model('Reject', RejectSchema);