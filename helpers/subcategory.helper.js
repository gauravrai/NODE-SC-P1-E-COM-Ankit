const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var SubCategory = model.sub_category;

module.exports = {
	getSubCatNameById: async function(subcategoryId, cb) {
        //console.log(subcategoryId);return false;
        let data = await SubCategory.findOne({_id: mongoose.mongo.ObjectId(subcategoryId)},{sub_cat_name:1, _id:0});
        //console.log(data);return false;
		cb(data);
	}
};