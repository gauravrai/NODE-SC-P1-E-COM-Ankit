var indexController = require('../../controllers/admin/notification/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_notification', isloggedin, indexController.manageNotification); 
    router.all(config.constant.ADMINCALLURL+'/list_notification', isloggedin, indexController.listNotification); 
    router.all(config.constant.ADMINCALLURL+'/add_notification',isloggedin, indexController.addNotification);   
}