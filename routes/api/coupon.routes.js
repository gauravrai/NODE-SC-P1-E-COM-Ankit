var indexController = require('../../controllers/api/coupon/index.controller');
var config = require('../../config/index');
const auth = require('../../middleware/check-auth-jwt');
const { check } = require('express-validator')

module.exports = function(router) {
  	router.post(
		config.constant.APIURL+'/applyCoupon', 
		[
			// auth,
			// [
				check('couponNo', 'Coupon Number is required').not().isEmpty(),
				check('userId', 'User Id is required').not().isEmpty(),
				check('cartId', 'Cart Id is required').not().isEmpty()
			// ]
		], 
		indexController.applyCoupon
	); 
	router.post(
	  config.constant.APIURL+'/removeAppliedCoupon', 
	  [
		  // auth,
		  // [
			  check('userId', 'User Id is required').not().isEmpty(),
			  check('cartId', 'Cart Id is required').not().isEmpty()
		  // ]
	  ], 
	  indexController.removeAppliedCoupon
  ); 
	router.get(
		config.constant.APIURL+'/getCoupon', indexController.getCoupon
	); 
}