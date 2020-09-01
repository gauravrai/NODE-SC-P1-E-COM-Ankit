var indexController = require('../../controllers/api/product/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
    router.get(config.constant.APIURL+'/product', indexController.productList); 
    
}