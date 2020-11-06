const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let StoreSchema = new Schema({
    name: {
        type: String
    },
    address: {
        type: String
    },
    contactName: {
        type: String
    },
    contactNumber: {
        type: Number
    },
    stateId: {
        type: ObjectId
    },
    cityId: {
        type: ObjectId
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
module.exports = mongoose.model('Store', StoreSchema);