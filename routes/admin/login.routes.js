const loginController = require('../../controllers/admin/login.controller');
var config = require('../../config/index');
var isloggedinadmin = config.middleware.isloggedinadmin;

module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL,isloggedinadmin, loginController.index);   
    router.get(config.constant.ADMINCALLURL+'/logout', loginController.logout);   
    router.all(config.constant.ADMINCALLURL+'/create', loginController.create);  
    router.all(config.constant.ADMINCALLURL+'/forgot_password', loginController.forgotPassword);  
    router.all(config.constant.ADMINCALLURL+'/reset_password', loginController.resetPassword);  
    router.all(config.constant.ADMINCALLURL+'/lock_screen', loginController.lockScreen);  
}
