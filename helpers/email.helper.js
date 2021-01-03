const model  = require('../models/index.model');
const config = require('../config/index');
const nodemailer = require('nodemailer');

module.exports = {
	sendEmail: async function(email, subject, message, cb) {
		var transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			// requireTLS: true,
			auth: {
				user: 'ersonalirps@gmail.com',
				pass: '9570720714'
			},
			tls: {
				rejectUnauthorized: false
			}
		});
		var mailOptions = {
			from: 'ersonalirps@gmail.com',
			to: email,
			subject: subject,
			html: message
		}
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			  console.log(error);
			  cb(0);
			} else {
			  console.log('Email sent: ' + info.response);
			  cb(1);
			}
		});
	},
};


