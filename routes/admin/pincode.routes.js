var indexController = require('../../controllers/admin/pincode/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_pincode', isloggedin, indexController.managePincode); 
    router.all(config.constant.ADMINCALLURL+'/list_pincode', isloggedin, indexController.listPincode); 
    router.all(config.constant.ADMINCALLURL+'/add_pincode',isloggedin, indexController.addPincode);   
    router.all(config.constant.ADMINCALLURL+'/edit_pincode',isloggedin, indexController.editPincode);   
    router.all(config.constant.ADMINCALLURL+'/delete_pincode/:id',isloggedin, indexController.deletePincode);   
    router.all(config.constant.ADMINCALLURL+'/change_status_pincode/:id',isloggedin, indexController.changeStatusPincode); 
}