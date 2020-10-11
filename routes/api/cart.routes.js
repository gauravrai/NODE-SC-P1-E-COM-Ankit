var indexController = require('../../controllers/api/cart/index.controller');
var config = require('../../config/index');
const { check } = require('express-validator')

module.exports = function(router) {
  	router.post(
		config.constant.APIURL+'/addToCart', 
		[
      		check('productId', 'Product Id is required').not().isEmpty()
		], 
		indexController.addToCart
	); 
}