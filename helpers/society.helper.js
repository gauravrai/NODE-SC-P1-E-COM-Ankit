const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var Society = model.society;

module.exports = {
	getNameById: async function(societyId, cb) {
		if(societyId && typeof societyId != 'undefined')
		{
			let data = await Society.findOne({_id: mongoose.mongo.ObjectId(societyId)},{name: 1, _id:0});
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


