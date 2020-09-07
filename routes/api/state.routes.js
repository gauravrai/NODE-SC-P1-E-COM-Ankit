var indexController = require('../../controllers/api/state/index.controller');
var config = require('../../config/index');

module.exports = function(router) {
     router.all(config.constant.APIURL+'/state', indexController.stateList); 

    
}