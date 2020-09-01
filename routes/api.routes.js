var express = require('express');

module.exports = function(app) {

	//routes
	var categoryRoutes = require('./api/categories.routes');
	var subcategoryRoutes = require('./api/subcategories.routes');
	var productRoutes = require('./api/product.routes');
	//var roleRoutes = require('./api/category.routes');
	
	var router = express.Router();
	app.use('',router);

	//import api routes
	categoryRoutes(router);
	subcategoryRoutes(router);
	productRoutes(router);
	//dashboardRoutes(router);
	
}