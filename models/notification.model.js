const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let NotificationSchema = new Schema({
    // pincodeType: {
    //     type: String
    // },
    // pincodeId: {
    //     type: Array
    // },
    userType: {
        type: String
    },
    userId: {
        type: Array
    },
    expiryDate: {
        type: Date 
    },
    message: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    deletedAt: {
        type: Number,
        default: 0
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
module.exports = mongoose.model('notification', NotificationSchema);