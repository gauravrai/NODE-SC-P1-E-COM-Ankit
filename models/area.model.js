const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let AreaSchema = new Schema({
    name: {
        type: String
    },
    stateId: {
        type: ObjectId
    },
    cityId: {
        type: ObjectId
    },
    pincodeId: {
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
module.exports = mongoose.model('Area', AreaSchema);