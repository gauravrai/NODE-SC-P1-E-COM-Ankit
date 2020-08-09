const adminController = require('../../controllers/admin/login.controller');
var config = require('../../config/index');
var isloggedinadmin = config.middleware.isloggedinadmin;

module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL,isloggedinadmin, adminController.index);   
    router.get(config.constant.ADMINCALLURL+'/logout', adminController.logout);   
    router.all(config.constant.ADMINCALLURL+'/create', adminController.create); 
    // router.get(config.constant.ADMINCALLURL+'/resetpassword', adminController.resetpassword); 
    // router.all(config.constant.ADMINCALLURL+'/check_email', adminController.check_email); 
}
