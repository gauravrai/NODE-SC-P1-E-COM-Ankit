const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var Product = model.product;

module.exports = {
	getNameById: async function(productId, cb) {
		if(productId && typeof productId != 'undefined')
		{
			let data = await Product.findOne({_id: mongoose.mongo.ObjectId(productId)},{name: 1, _id:0});
			if(data)
				cb(data);
			else
				cb('');
		}else
		{
			cb('');
		}
	}
};