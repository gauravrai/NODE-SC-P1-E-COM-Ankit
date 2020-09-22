var indexController = require('../../controllers/api/product/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
    router.post(config.constant.APIURL+'/product', indexController.productList); 
    router.get(config.constant.APIURL+'/getproductBycat', indexController.productListByCatId);
    router.get(config.constant.APIURL+'/getproductBySubcat', indexController.productListBySubCatId);
    router.all(config.constant.APIURL+'/searchproduct', indexController.searchProduct);

    
}