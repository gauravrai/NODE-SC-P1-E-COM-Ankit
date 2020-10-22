const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let CustomerSchema = new Schema({

    mobile: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        default: null
    },
    stateId: {
        type: ObjectId,
    },
    cityId: {
        type: ObjectId,
    },
    pincodeId: {
        type: ObjectId,
    },
    areaId: {
        type: ObjectId,
    },
    societyId: {
        type: ObjectId,
    },
    // TODO: Look into this.
    // towerId: {
    //     type: ObjectId,
    // },
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
module.exports = mongoose.model('customer', CustomerSchema);