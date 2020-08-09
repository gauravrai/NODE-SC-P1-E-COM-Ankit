var indexController = require('../../controllers/admin/dashboard/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/dashboard', isloggedin, indexController.index); 
    router.all(config.constant.ADMINCALLURL+'/allmenu', isloggedin, indexController.allmenu);    
}