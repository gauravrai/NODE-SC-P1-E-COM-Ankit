const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var request = require('request');
var Message = model.message;

module.exports = {
	sendSMS: async function(userData, slug, message, cb) {
		let username = config.constant.SMS_API_USERNAME;
		let apiKey = config.constant.SMS_API_KEY;
		let apiRequest  = 'Text';
		let senderID = config.constant.SMS_API_SID; 
		let apiRoute = 'TRANS'; 
		let mobile = userData.mobile;
		var url =  'http://www.alots.in/sms-panel/api/http/index.php?username='+username+'&apikey='+apiKey+'&apirequest='+apiRequest+'&route='+apiRoute+'&mobile='+mobile+'&sender='+senderID+"&message="+message;
		var mes = message;
		request.get(url, function(err, result, body){
			let messageInsertData = {
				userId: mongoose.mongo.ObjectId(userData.id),
				slug: slug,
				message: mes
			};
			let message = new Message(messageInsertData);
			message.save();
			cb(1);
		});
	},
	sendOTP: async function(mobile, slug, message, cb) {
		let username = config.constant.SMS_API_USERNAME;
		let apiKey = config.constant.SMS_API_KEY;
		let apiRequest  = 'Text';
		let senderID = config.constant.SMS_API_SID; 
		let apiRoute = 'TRANS'; 
		var url =  'http://www.alots.in/sms-panel/api/http/index.php?username='+username+'&apikey='+apiKey+'&apirequest='+apiRequest+'&route='+apiRoute+'&mobile='+mobile+'&sender='+senderID+"&message="+message;
		var mes = message;
		request.get(url, function(err, result, body){
			cb(1);
		});
	}
};


