var indexController = require('../../controllers/api/cart/index.controller');
var config = require('../../config/index');
const { check } = require('express-validator')

module.exports = function(router) {
  	router.post(
		config.constant.APIURL+'/addToCart', 
		[
      		check('productId', 'Product Id is required').not().isEmpty(),
      		check('varientId', 'Varient Id is required').not().isEmpty(),
      		check('price', 'Price is required').not().isEmpty(),
      		check('quantity', 'Quantity is required').not().isEmpty()
		], 
		indexController.addToCart
	); 
	router.post(
		config.constant.APIURL+'/removeFromCart', 
		[
			check('cartItemId', 'cart Item Id is required').not().isEmpty()
		], 
		indexController.removeFromCart
	);
	router.get(
		config.constant.APIURL+'/getCartData', indexController.getCartData
	); 
}