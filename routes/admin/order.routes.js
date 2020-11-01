var indexController = require('../../controllers/admin/order/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_order', isloggedin, indexController.manageOrder);
    router.all(config.constant.ADMINCALLURL+'/list_order', isloggedin, indexController.listOrder); 
    router.all(config.constant.ADMINCALLURL+'/order_detail',isloggedin, indexController.orderDetail); 
    router.all(config.constant.ADMINCALLURL+'/add_order',isloggedin, indexController.addOrder); 
    router.all(config.constant.ADMINCALLURL+'/change_status_order_detail/:id',isloggedin, indexController.changeStatusOrderDetail); 
}