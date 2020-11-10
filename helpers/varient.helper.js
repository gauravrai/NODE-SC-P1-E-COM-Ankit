const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var Varient = model.varient;

module.exports = {
	getNameById: async function(varientId, cb) {
		if(varientId && typeof varientId != 'undefined')
		{
			let data = await Varient.findOne({_id: mongoose.mongo.ObjectId(varientId)},{label: 1, measurementUnit: 1, _id:0});
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


