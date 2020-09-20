const indexController = require('../../controllers/api/customer/index.controller');
const config = require('../../config/index');
const auth = require('../../middleware/check-auth-jwt');
const { check } = require('express-validator')

module.exports = function(router) {
	router.post(
		config.constant.APIURL+'/addcustomer', 
		[
		    check('mobile', 'Mobile is required').not().isEmpty()
		], 
		indexController.addCustomer
	); 
	router.post(
		config.constant.APIURL+'/checkcustomerotp', 
		[
		    check('mobile', 'Mobile is required').not().isEmpty().trim().escape(),
		    check('otp', 'OTP is required').not().isEmpty().trim()
		],
		indexController.checkCustomerOtp
	);
	router.post(config.constant.APIURL+'/customer', auth, indexController.customer);
	router.post(
		config.constant.APIURL+'/update_customerprofile', 
		[
			auth,
			[
				check('name', 'Name is required')
						.not()
						.isEmpty()
						.trim()
						.escape(),
		    	check('email', 'Email is required')
		    			.not()
		    			.isEmpty()
		    			.isEmail()
    					.normalizeEmail()
			]
		], 
		indexController.updateCustomer
	);

    
}