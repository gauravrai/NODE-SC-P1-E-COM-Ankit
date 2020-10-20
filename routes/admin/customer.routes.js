var indexController = require('../../controllers/admin/customer/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;

module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_customer', isloggedin, indexController.manageCustomer);
    router.all(config.constant.ADMINCALLURL+'/list_customer', isloggedin, indexController.listCustomer); 
    router.all(config.constant.ADMINCALLURL+'/add_customer',isloggedin, indexController.addCustomer);
    router.all(config.constant.ADMINCALLURL+'/change_status_customer/:id',isloggedin, indexController.changeStatusCustomer); 
}