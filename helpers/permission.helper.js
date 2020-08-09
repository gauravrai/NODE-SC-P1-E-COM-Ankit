const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
const Menu = model.menu;
const Admin = model.admin;

module.exports = async function(slug, req, cb) {
	let adminId = req.session.ADMINID;
	await Menu.aggregate([
		{
			$unwind:"$submenu"
		},
		{
			$match:{
				"submenu.slug":slug ? slug : ''
			}
		}
	]).exec(async function(err,menuData){
		if(err){console.log(err)}
		let permission = '';
		if(menuData && menuData.length>0){
			permission = menuData[0].submenu ? menuData[0].submenu.id : '';
		}else{
			permission = {id:'', add:0, edit:0,delete:0};
		}
		await Admin.aggregate([
			{
				$match:{
					_id:mongoose.mongo.ObjectId(adminId)
				}
			},
			{
				$lookup:{
					from:"roles",
					localField:"roleId",
					foreignField:"_id",
					as:"role"
				}
			},
			{$unwind:"$role"},
			{$unwind:"$role.permission"},
			{ $replaceRoot: { newRoot: "$role.permission" } },
			{$match:{id:permission.toString()}}
		]).exec(function(err,adminData){
			if(err){console.log(err)}
			if(adminData && adminData.length>0){
				cb(err, adminData[0]);
			}else{
				let data = {id:'', add:0, edit:0,delete:0};
				cb(err, data);
			}
		})
	});
}


