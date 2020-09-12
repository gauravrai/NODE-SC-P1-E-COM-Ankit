const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var SubCategory = model.sub_category;

module.exports = {
	getNameById: async function(subcategoryId, cb) {
        let data = await SubCategory.findOne({_id: mongoose.mongo.ObjectId(subcategoryId)},{name:1, _id:0});
        //console.log(data);return false;
		cb(data);
	}
};