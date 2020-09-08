var indexController = require('../../controllers/api/societies/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
     router.all(config.constant.APIURL+'/societies', indexController.societiesListByAreaId); 

    
}