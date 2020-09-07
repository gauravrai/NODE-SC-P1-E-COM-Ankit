var indexController = require('../../controllers/api/area/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
     router.all(config.constant.APIURL+'/area', indexController.areaList); 

    
}