const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var City = model.city;

module.exports = {
	getNameById: async function(cityId, cb) {
		if(cityId && typeof cityId != 'undefined')
		{
			let data = await City.findOne({_id: mongoose.mongo.ObjectId(cityId)},{name: 1, _id:0});
			cb(data);
		}else
		{
			cb('');
		}
	}
};


