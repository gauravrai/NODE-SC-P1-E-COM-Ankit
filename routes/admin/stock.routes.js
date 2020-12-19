var indexController = require('../../controllers/admin/stock/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/manage_stock', isloggedin, indexController.manageStock);
    router.all(config.constant.ADMINCALLURL+'/list_stock', isloggedin, indexController.listStock); 
    router.all(config.constant.ADMINCALLURL+'/add_stock',isloggedin, indexController.addStock);
    router.all(config.constant.ADMINCALLURL+'/change_status_stock/:id',isloggedin, indexController.changeStatusStock); 
    router.all(config.constant.ADMINCALLURL+'/delete_stock/:id',isloggedin, indexController.deleteStock);  
    router.all(config.constant.ADMINCALLURL+'/transfer_stock',isloggedin, indexController.transferStock);  
    
}