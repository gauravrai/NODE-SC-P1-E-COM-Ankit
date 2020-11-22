var indexController = require('../../controllers/admin/contact/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_contact', isloggedin, indexController.manageContact);
    router.all(config.constant.ADMINCALLURL+'/list_contact', isloggedin, indexController.listContact); 
}