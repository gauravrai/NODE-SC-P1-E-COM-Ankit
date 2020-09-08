var indexController = require('../../controllers/api/brand/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
     router.all(config.constant.APIURL+'/brand', indexController.brandList); 

    
}