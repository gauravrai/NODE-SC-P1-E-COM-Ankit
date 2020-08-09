const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var Role = model.role;

module.exports = {
	getNameById: async function(roleId, cb) {
		let data = await Role.findOne({_id: mongoose.mongo.ObjectId(roleId)},{name: 1, _id:0});
		cb(data);
	}
};


