var indexController = require('../../controllers/admin/wallet/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_wallet', isloggedin, indexController.manageWallet); 
    router.all(config.constant.ADMINCALLURL+'/list_wallet', isloggedin, indexController.listWallet); 
    router.all(config.constant.ADMINCALLURL+'/add_wallet', indexController.addWallet);   
    router.all(config.constant.ADMINCALLURL+'/view_wallet',isloggedin, indexController.viewWallet);      
}