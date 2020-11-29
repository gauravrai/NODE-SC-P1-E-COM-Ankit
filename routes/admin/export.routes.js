var indexController = require('../../controllers/admin/export/index.controller');
var config = require('../../config/index');
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(config.constant.ADMINCALLURL+'/export_role',isloggedin, indexController.exportRole);
    router.all(config.constant.ADMINCALLURL+'/export_adminstrator',isloggedin, indexController.exportAdminstrator);
    router.all(config.constant.ADMINCALLURL+'/export_brand',isloggedin, indexController.exportBrand);
    router.all(config.constant.ADMINCALLURL+'/export_category',isloggedin, indexController.exportCategory);
    router.all(config.constant.ADMINCALLURL+'/export_subcategory',isloggedin, indexController.exportSubcategory);
    router.all(config.constant.ADMINCALLURL+'/export_state',isloggedin, indexController.exportState);
    router.all(config.constant.ADMINCALLURL+'/export_city',isloggedin, indexController.exportCity);
    router.all(config.constant.ADMINCALLURL+'/export_pincode',isloggedin, indexController.exportPincode);
    router.all(config.constant.ADMINCALLURL+'/export_area',isloggedin, indexController.exportArea);
    router.all(config.constant.ADMINCALLURL+'/export_society',isloggedin, indexController.exportSociety);
    router.all(config.constant.ADMINCALLURL+'/export_tower',isloggedin, indexController.exportTower);
    router.all(config.constant.ADMINCALLURL+'/export_store',isloggedin, indexController.exportStore);
}