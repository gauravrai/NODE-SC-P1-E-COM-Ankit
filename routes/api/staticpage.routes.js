var indexController = require('../../controllers/api/staticpage/index.controller');
var config = require('../../config/index');
const { check } = require('express-validator')

module.exports = function(router) {
  router.get(
    config.constant.APIURL+'/getStaticPageData', 
    [
      check('pageName', 'Page Name is required').not().isEmpty()
    ], 
    indexController.getStaticPageData
  );    
  router.post(
    config.constant.APIURL+'/contactUs', 
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Email is required').not().isEmpty(),
      check('phone', 'Phone is required').not().isEmpty(),
      check('message', 'Message is required').not().isEmpty()
    ], 
    indexController.contactUs
  );    
}