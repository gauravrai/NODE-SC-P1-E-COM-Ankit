const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
var request = require('request');
var Area = model.area;

module.exports = {
	sendSMS: async function(oderData, cb) {
		
request.post('http://www.alots.in/sms-panel/api/http/index.php', {
	auth: {
	  username: 'evamastuT', // Specify your API username
	  password: 'LV9GY' // Specify your API password
	},
	form: {
	  from : 'Node', // The sender of the SMS, up to 11 characters
	  to : 8130043856, // The number that will receive the text message
	  message : 'It is easy to send SMS with 46elks', // The content of the text message
	}
  }, function(err, res, body) {
	if (res.statusCode == 200) {
	  console.log("Sent! The API responded:")
	  console.log(JSON.parse(body))
	} else {
	  console.log("Error:")
	  console.log(body)
	  cb(1);
	}
  })
		// let username = config.constant.SMS_API_USERNAME;
		// let apiKey = config.constant.SMS_API_KEY;
		// let apiRequest  = 'Text';
		// let senderID = config.constant.SMS_API_SID; 
		// let apiRoute = 'TRANS'; 
		// var url =  'http://www.alots.in/sms-panel/api/http/index.php';
		// var message = "Hi sonali , your order  is confirmed and will be shipped soon. Thanks for shopping with us.";
		// var params = {
		// 	username: username,
		// 	apiKey: apiKey,
		// 	apiRequest: apiRequest,
		// 	senderID: senderID,
		// 	apiRoute: apiRoute,
		// 	mobile    : 8130043856,
		// 	message  : message,
		// }
		
		// console.log(params)
		// request.post(url,{form:params}, function(err,result,body){	
		// 	console.log(err);	
		// 	console.log(body);	
		// 	cb(1);
		// });
	}
};


