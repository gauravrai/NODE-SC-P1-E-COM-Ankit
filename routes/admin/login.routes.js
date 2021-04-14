const loginController = require('../../controllers/admin/login.controller');
var config = require('../../config/index');
var isloggedinadmin = config.middleware.isloggedinadmin;

module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL,isloggedinadmin, loginController.index);   
    router.get(config.constant.ADMINCALLURL+'/logout', loginController.logout);   
    router.all(config.constant.ADMINCALLURL+'/create', loginController.create);   
    router.all(config.constant.ADMINCALLURL+'/lock_screen', loginController.lockScreen);  
    // router.get(config.constant.ADMINCALLURL+'/resetpassword', loginController.resetpassword); 
    // router.all(config.constant.ADMINCALLURL+'/check_email', loginController.check_email); 
}
