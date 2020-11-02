const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var request = require('request');
var Area = model.area;

module.exports = {
	sendSMS: async function(oderData, cb) {
		let username = config.constant.SMS_API_USERNAME;
		let apiKey = config.constant.SMS_API_KEY;
		let apiRequest  = 'Text';
		let senderID = config.constant.SMS_API_SID; 
		let apiRoute = 'TRANS'; 
		var url =  'http://www.alots.in/sms-panel/api/http/index.php';
		var message = "Hi sonali , your order  is confirmed and will be shipped soon. Thanks for shopping with us.";
		var params = {
			username: username,
			apiKey: apiKey,
			apiRequest: apiRequest,
			senderID: senderID,
			apiRoute: apiRoute,
			mobile    : 8130043856,
			message  : message,
		}
		
		console.log(params)
		request.post(url,{form:params}, function(err,result,body){	
			console.log(err);	
			console.log(body);	
			cb(1);
		});
	}
};


