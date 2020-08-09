const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var State = model.state;

module.exports = {
	getNameById: async function(stateId, cb) {
		let data = await State.findOne({_id: mongoose.mongo.ObjectId(stateId)},{name: 1, _id:0});
		cb(data);
	}
};


