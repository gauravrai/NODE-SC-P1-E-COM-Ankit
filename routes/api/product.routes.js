var indexController = require('../../controllers/api/product/index.controller');
var config = require('../../config/index');
const { check } = require('express-validator')

module.exports = function(router) {
    router.get(config.constant.APIURL+'/product', indexController.productList);
    router.get(
		config.constant.APIURL+'/searchproduct', 
		[
		    check('string', 'String is required').not().isEmpty()
		], 
		indexController.searchProduct
	); 
    router.get(config.constant.APIURL+'/getproductBycat', indexController.productListByCatId);
    router.get(config.constant.APIURL+'/getproductBySubcat', indexController.productListBySubCatId);

    
}