const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//var objectId = mongoose.Schema.Types.ObjectId;
let ProfileSchema = new Schema({
    name: {
        type: String,
    },
    slug: {
        type: String,
    },
    order: {
        type: Number,
    },
    image: {
        type: Object,
    },
    status: {
        type: Boolean,
        default: true,
    },
    deletedAt: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("Profile", ProfileSchema);