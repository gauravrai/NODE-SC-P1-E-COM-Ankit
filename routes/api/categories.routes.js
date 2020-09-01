var indexController = require('../../controllers/api/categories/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
    router.all(config.constant.APIURL+'/categories', indexController.categories); 
    
}