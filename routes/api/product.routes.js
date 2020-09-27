var indexController = require('../../controllers/api/product/index.controller');
var config = require('../../config/index');
const { check } = require('express-validator')

module.exports = function(router) {
	router.get(config.constant.APIURL+'/product', indexController.productList);
	router.get(
		config.constant.APIURL+'/productDetail', 
		[
		    check('productId', 'Product id is required').not().isEmpty()
		], 
		indexController.productDetail
	); 
    router.get(
		config.constant.APIURL+'/searchproduct', 
		[
		    check('string', 'String is required').not().isEmpty()
		], 
		indexController.searchProduct
	); 
    router.post(
		config.constant.APIURL+'/userRequestForProduct', 
		[
		    check('productId', 'Product Id is required').not().isEmpty(),
		    check('name', 'Name is required').not().isEmpty(),
		    check('email', 'Email is required').not().isEmpty().isEmail(),
		    check('mobile', 'Mobile is required').not().isEmpty(),
		    check('address', 'Address is required').not().isEmpty(),
		    check('pincode', 'Pincode is required').not().isEmpty(),
		    check('description', 'Description is required').not().isEmpty()
		], 
		indexController.userRequestForProduct
	); 
}