var indexController = require("../../controllers/admin/profile/index.controller");
var config = require("../../config/index");
var isloggedin = config.middleware.isloggedin;
module.exports = function(router) {
    router.all(
        config.constant.ADMINCALLURL + "/manage_profile",
        isloggedin,
        indexController.manageProfile
    );
    router.all(
        config.constant.ADMINCALLURL + "/list_profile",
        isloggedin,
        indexController.listProfile
    );
    router.all(
        config.constant.ADMINCALLURL + "/add_profile",
        isloggedin,
        indexController.addProfile
    );
    router.all(
        config.constant.ADMINCALLURL + "/edit_profile",
        isloggedin,
        indexController.editProfile
    );
    router.all(
        config.constant.ADMINCALLURL + "/delete_profile/:id",
        isloggedin,
        indexController.deleteProfile
    );
    router.all(
        config.constant.ADMINCALLURL + "/change_status_profile/:id",
        isloggedin,
        indexController.changeStatusProfile
    );
    router.all(
        config.constant.ADMINCALLURL + "/check_slug_profile",
        isloggedin,
        indexController.checkSlugProfile
    );
};