const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var Category = model.category;

module.exports = {
	getNameById: async function(categoryId, cb) {
		let data = await Category.findOne({_id: mongoose.mongo.ObjectId(categoryId)},{name: 1, _id:0});
		cb(data);
	}
};