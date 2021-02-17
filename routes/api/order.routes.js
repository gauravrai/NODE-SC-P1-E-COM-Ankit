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
	router.post(
	  config.constant.APIURL+'/managePaymentResponse', 
	  [
		  // auth,
		  // [
			  check('userId', 'User Id is required').not().isEmpty(),
			  check('razorpayOrderId', 'Razorpay Order Id is required').not().isEmpty(),
		  // ]
	  ],
	  indexController.managePaymentResponse
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
	  config.constant.APIURL+'/checkPayment', 
	  [
		  // auth,
		  // [
			  check('userId', 'User Id is required').not().isEmpty(),
			  check('odid', 'Order Id is required').not().isEmpty(),
			  check('paymentId', 'Payment Id is required').not().isEmpty(),
			  check('orderId', 'Razor Pay Order Id is required').not().isEmpty(),
			  check('walletAmount', 'Wallet Amount is required').not().isEmpty(),
		  // ]
	  ],
	  indexController.checkPayment
 	); 
}