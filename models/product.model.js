const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let ProductSchema = new Schema({
    name: {
        type: String
    },
    cate_id: {
        type: ObjectId
    },
    s_cate_id: {
        type: ObjectId
    },
    price: {
        type: String

    },
    inventory:{
        store_id: {
            type: ObjectId,
        },
        quantity: {
            type: String,
        },
    },
    offer:{
        type: String
    },
    discount:{
        type: String
    },
    discription:{
        type: String
    },
    seo_keyword:{
        type: String
    },
    image:{
        thumb_image: {
            type: String,
        },
        small_image: {
            type: String,
        },
        large_image: {
            type: String
        }
    },
    image1:{
        type: String
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