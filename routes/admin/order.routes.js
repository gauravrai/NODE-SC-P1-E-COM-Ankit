var indexController = require('../../controllers/admin/order/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_order', isloggedin, indexController.manageOrder);
    router.all(config.constant.ADMINCALLURL+'/list_order', isloggedin, indexController.listOrder); 
    router.all(config.constant.ADMINCALLURL+'/order_detail',isloggedin, indexController.orderDetail); 
    router.all(config.constant.ADMINCALLURL+'/add_order',isloggedin, indexController.addOrder);  
    router.all(config.constant.ADMINCALLURL+'/mark_as_not_available',isloggedin, indexController.markAsNotAvailable); 
    router.all(config.constant.ADMINCALLURL+'/change_order_status',isloggedin, indexController.changeOrderStatus); 
    router.all(config.constant.ADMINCALLURL+'/check_available_product',isloggedin, indexController.checkAvailableProduct); 
}