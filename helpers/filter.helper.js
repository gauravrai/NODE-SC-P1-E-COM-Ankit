const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");

module.exports = {
	orderFilter: async function(req, cb) {
		var query = "?search=1";
		
		if(req.param('search_data')){
			query = query+"&search_data="+req.param('search_data');
		}
		if(req.param("order_status") && req.param("order_status") != ''){
				
			query = query+"&order_status="+req.param("order_status");
		}
		if(req.param('date_from')){
			query = query+"&date_from="+req.param('date_from');
		}
		if(req.param('date_to')){
			query = query+"&date_to="+req.param('date_to');
		}
	
		if(query!="?search=1"){
			cb(query);
		}else{

			cb('');
		}
	}
};


