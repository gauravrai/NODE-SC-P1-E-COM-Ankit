const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let AdminSchema = new Schema({
    superadmin: {
        type: Boolean
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    username: {
        type: String, 
        required: true, 
        max: 100
    },
    password: {
        type: String, 
        required: true
    },
    roleId: {
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
module.exports = mongoose.model('Admin', AdminSchema);