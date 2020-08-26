const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var Product = model.product;

module.exports = {
	getNameById: async function(productId, cb) {
		let data = await Product.findOne({_id: mongoose.mongo.ObjectId(productId)},{name: 1, _id:0});
		cb(data);
	}
};