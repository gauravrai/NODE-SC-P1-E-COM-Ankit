var indexController = require('../../controllers/admin/productrequest/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_product_request', isloggedin, indexController.manageProductRequest);
    router.all(config.constant.ADMINCALLURL+'/list_product_request', isloggedin, indexController.listProductRequest); 
}