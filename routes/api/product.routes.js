var indexController = require('../../controllers/api/product/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
    router.get(config.constant.APIURL+'/product', indexController.productList); 
    router.get(config.constant.APIURL+'/getproductBycat', indexController.productListByCatId);
    router.get(config.constant.APIURL+'/getproductBySubcat', indexController.productListBySubCatId);

    
}