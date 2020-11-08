const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var Store = model.store;

module.exports = {
	getNameById: async function(storeId, cb) {
		if(storeId && typeof storeId != 'undefined')
		{
			let data = await Store.findOne({_id: mongoose.mongo.ObjectId(storeId)},{name: 1, _id:0});
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
