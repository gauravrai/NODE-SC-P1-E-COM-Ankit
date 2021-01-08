var indexController = require('../../controllers/api/order/index.controller');
var config = require('../../config/index');
const auth = require('../../middleware/check-auth-jwt');
const { check } = require('express-validator')

module.exports = function(router) {
  	router.post(
		config.constant.APIURL+'/placeOrder', 
		[
			// auth,
			// [
				check('userId', 'User Id is required').not().isEmpty(),
				check('paymentType', 'Payment Type is required').not().isEmpty(),
				check('orderFrom', 'Order From is required').not().isEmpty(),
				check('walletPayment', 'Wallet Payment is required').not().isEmpty()
			// ]
		],
		indexController.placeOrder
	); 
	router.get(
		config.constant.APIURL+'/getOrderData', 
		[
			// auth,
			// [
				check('userId', 'User Id is required').not().isEmpty(),
			// ]
		],
		indexController.getOrderData
	);  
	router.get(
		config.constant.APIURL+'/getInvoiceData', 
		[
			// auth,
			// [
				check('odid', 'Order Id is required').not().isEmpty(),
			// ]
		],
		indexController.getInvoiceData
	); 
	router.post(
	  config.constant.APIURL+'/checkPayment', indexController.checkPayment
 	); 
}