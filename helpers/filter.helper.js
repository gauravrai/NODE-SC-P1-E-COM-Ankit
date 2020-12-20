const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");

module.exports = {
	orderFilter: async function(req, cb) {
		var query = "?search=1";
		
		if(req.query.search_data){
			query = query+"&search_data="+req.query.search_data;
		}
		if(req.query.order_status && req.query.order_status != ''){
				
			query = query+"&order_status="+req.query.order_status;
		}
		if(req.query.date_from){
			query = query+"&date_from="+req.query.date_from;
		}
		if(req.query.date_to){
			query = query+"&date_to="+req.query.date_to;
		}
	
		if(query!="?search=1"){
			cb(query);
		}else{

			cb('');
		}
	},
	
	walletFilter: async function(req, cb) {
		var query = "?search=1";
		
		if(req.query.date_from){
			query = query+"&date_from="+req.query.date_from;
		}
		if(req.query.date_to){
			query = query+"&date_to="+req.query.date_to;
		}
	
		if(query!="?search=1"){
			cb(query);
		}else{

			cb('');
		}
	}
};


