const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let ProductSchema = new Schema({
    name: {
        type: String
    },
    categoryId: {
        type: ObjectId
    },
    subcategoryId: {
        type: ObjectId
    },
    offer: {
        type: String,
    },
    discount:{
        type: String
    },
    description:{
        type: String
    },
    stock: {
        type: String
    },
    brandId:{
        type: ObjectId
    },
    featured: {
        type: Boolean,
    },
    weight: {
        type: String
    },
    inventory:{
        type:  Array
    },
    image:{
        type:  Array
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
module.exports = mongoose.model('product', ProductSchema);