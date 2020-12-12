var indexController = require('../../controllers/admin/customer/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;

module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_customer', isloggedin, indexController.manageCustomer);
    router.all(config.constant.ADMINCALLURL+'/list_customer', isloggedin, indexController.listCustomer); 
    router.all(config.constant.ADMINCALLURL+'/add_customer',isloggedin, indexController.addCustomer);
    router.all(config.constant.ADMINCALLURL+'/change_status_customer/:id',isloggedin, indexController.changeStatusCustomer);
    // ** delete customer functionality removed for now.
    // router.all(config.constant.ADMINCALLURL+'/delete_customer/:id',isloggedin, indexController.deleteCustomer);
    router.all(config.constant.ADMINCALLURL+'/edit_customer',isloggedin, indexController.editCustomer);
    router.all(config.constant.ADMINCALLURL+'/view_customer_dashboard',isloggedin, indexController.viewCustomerDashboard);
}