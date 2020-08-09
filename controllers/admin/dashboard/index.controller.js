const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const Admin = model.admin;
const Menu = model.menu;

module.exports = {
	index: async function(req,res)
	{	
		let pageTitle = 'Dashboard';
		res.render('admin/dashboard/dashboard',{layout:'admin/layout/layout', pageTitle:pageTitle} );
	},
	allmenu: async function(req,res){
		await Admin.aggregate([
			{
				$match:{
					_id:mongoose.mongo.ObjectId(req.session.ADMINID),
				}
			},
			{
				$lookup:{
					from:"roles",
					localField:"roleId",
					foreignField:"_id",
					as:'role'
				}
			},
			{
				$unwind:"$role"
			},
			{
				$unwind:"$role.permission"
			},
			{
				$group:{_id:null,menuId:{$push:"$role.permission.id"}}
			}
		]).exec(async function(err,menuId){
			if(menuId.length > 0)
			{
				let objectIdArray = menuId[0].menuId.map(s => mongoose.Types.ObjectId(s));
				let allMenu = await Menu.find({status:true,_id:{$in:objectIdArray}});
				res.render('admin/dashboard/menu',{layout:false, allMenu:allMenu,menuId:menuId} );	
			}
		})
	},
}
