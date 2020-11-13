const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
var ObjectId = mongoose.Schema.Types.ObjectId;
require('mongoose-double')(mongoose);

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
    price:{
        type: Number
    },
    featured: {
        type: Boolean,
    },
    outOfStock: {
        type: Boolean,
    },
    inventory:{
        type:  Array
    },
    image:{
        type:  Object
    },
    tax:{
        type:  SchemaTypes.Double,
        default : 0
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