const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var pincode = model.pincode;

module.exports = {
	getNameById: async function(pincodeId, cb) {
		if(pincodeId && typeof pincodeId != 'undefined')
		{
			let data = await pincode.findOne({_id: mongoose.mongo.ObjectId(pincodeId)},{pincode: 1, _id:0});
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


