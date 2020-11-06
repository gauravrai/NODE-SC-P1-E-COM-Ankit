const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var Area = model.area;

module.exports = {
	getNameById: async function(areaId, cb) {
		if(areaId && typeof areaId != 'undefined')
		{
			let data = await Area.findOne({_id: mongoose.mongo.ObjectId(areaId)},{name: 1, _id:0});
			cb(data);
		}else
		{
			cb('');
		}
	}
};


