const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var Customer = model.customer;

module.exports = {
	getNameById: async function(cityId, cb) {
		let data = await Customer.findOne({_id: mongoose.mongo.ObjectId(cityId)},{name: 1, _id:0});
		cb(data);
	},
	
	getMobileById: async function(cityId, cb) {
		let data = await Customer.findOne({_id: mongoose.mongo.ObjectId(cityId)},{mobile: 1, _id:0});
		cb(data);
	}
};


