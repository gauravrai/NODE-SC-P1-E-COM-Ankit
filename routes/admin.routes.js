var express = require('express');

module.exports = function(app) {

	//routes
	var loginRoutes = require('./admin/login.routes');
	var dashboardRoutes = require('./admin/dashboard.routes');
	var roleRoutes = require('./admin/role.routes');
	var administratorRoutes = require('./admin/administrator.routes');
	var categoryRoutes = require('./admin/category.routes');
	var stateRoutes = require('./admin/state.routes');
	var cityRoutes = require('./admin/city.routes');
	var pincodeRoutes = require('./admin/pincode.routes');
	var areaRoutes = require('./admin/area.routes');
	var societyRoutes = require('./admin/society.routes');
	var towerRoutes = require('./admin/tower.routes');

	var ajaxRoutes = require('./admin/ajax.routes');
	var router = express.Router();
	app.use('',router);

	//import admin routes
	loginRoutes(router);
	dashboardRoutes(router);
	roleRoutes(router);
	administratorRoutes(router);
	categoryRoutes(router);
	stateRoutes(router);
	cityRoutes(router);
	pincodeRoutes(router);
	areaRoutes(router);
	societyRoutes(router);
	towerRoutes(router);
	
	ajaxRoutes(router);
}
