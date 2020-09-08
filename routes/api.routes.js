var express = require('express');

module.exports = function(app) {

	//routes
	var categoryRoutes = require('./api/categories.routes');
	var subcategoryRoutes = require('./api/subcategories.routes');
	var productRoutes = require('./api/product.routes');
	var customerRoutes = require('./api/customer.routes');
	var stateRoutes = require('./api/state.routes');
	var cityRoutes = require('./api/city.routes');
	var pincodeRoutes = require('./api/pincode.routes');
	var areaRoutes = require('./api/area.routes');
	var societiesRoutes = require('./api/societies.routes');
	var towerRoutes = require('./api/tower.routes');
	var brandRoutes = require('./api/brand.routes');
	//var roleRoutes = require('./api/category.routes');
	
	var router = express.Router();
	app.use('',router);

	//import api routes
	categoryRoutes(router);
	subcategoryRoutes(router);
	productRoutes(router);
	customerRoutes(router);
	stateRoutes(router);
	cityRoutes(router);
	pincodeRoutes(router);
	areaRoutes(router);
	societiesRoutes(router);
	towerRoutes(router);
	brandRoutes(router);
	//dashboardRoutes(router);
	
}