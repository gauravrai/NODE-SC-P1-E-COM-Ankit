const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var Tower = model.tower;

module.exports = {
	getNameById: async function(towerId, cb) {
		if(towerId && typeof towerId != 'undefined')
		{
			let data = await Tower.findOne({_id: mongoose.mongo.ObjectId(towerId)},{name: 1, _id:0});
			if(data)
				cb(data);
			else
				cb('');
		}
		else{
			cb('');
		}
	}
};


