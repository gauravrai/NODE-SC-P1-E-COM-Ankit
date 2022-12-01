var indexController = require("../../controllers/admin/ipaddress/index.controller");
var config = require("../../config/index");
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(
        config.constant.ADMINCALLURL + "/manage_ipaddress",
        isloggedin,
        indexController.manageSubCategory
    );
    router.all(
        config.constant.ADMINCALLURL + "/list_ipaddress",
        isloggedin,
        indexController.listSubCategory
    );
    router.all(
        config.constant.ADMINCALLURL + "/add_ipaddress",
        isloggedin,
        indexController.addSubCategory
    );
    router.all(
        config.constant.ADMINCALLURL + "/edit_ipaddress",
        isloggedin,
        indexController.editSubCategory
    );
    router.all(
        config.constant.ADMINCALLURL + "/change_status_ipaddress/:id",
        isloggedin,
        indexController.changeStatusSubCategory
    );
    router.all(
        config.constant.ADMINCALLURL + "/delete_ipaddress/:id",
        isloggedin,
        indexController.deleteSubCategory
    );
};