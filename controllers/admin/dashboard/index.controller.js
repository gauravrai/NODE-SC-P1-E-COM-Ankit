const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const mongoose = require('mongoose');
const moment = require('moment');
const excel = require('exceljs');
const ADMINCALLURL = config.constant.ADMINCALLURL;
const Role = model.role;
const Admin = model.admin;
const Brand = model.brand;
const Category = model.category;
const Subcategory = model.sub_category;
const State = model.state;
const City = model.city;
const Pincode = model.pincode;
const Area = model.area;
const Society = model.society;
const Tower = model.tower;
const Store = model.store;
const Contact = model.contact;
const Customer = model.customer;
const Discount = model.discount;
const Product = model.product;
const Varient = model.varient;
const RequestProduct = model.request_product;
const Order = model.order;
const OrderDetail = model.order_detail;
const Wallet = model.wallet;
const Walletentry = model.wallet_entry;
const Stock = model.stock;
const Stockentry = model.stock_entries;
const Notification = model.notification;
const Menu = model.menu;

module.exports = {
	index: async function(req,res)
	{	
		let pageTitle = 'Dashboard';
		let userCount = await Customer.find({deletedAt: 0, status: true}).count();
		let orderCount = await Order.find({deletedAt: 0, status: true}).count();
		let productCount = await Product.find({deletedAt: 0, status: true}).count();
		let brandCount = await Brand.find({deletedAt: 0, status: true}).count();
		res.render('admin/dashboard/dashboard',{layout:'admin/layout/layout', pageTitle:pageTitle, userCount:userCount, orderCount:orderCount, productCount:productCount, brandCount:brandCount} );
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
