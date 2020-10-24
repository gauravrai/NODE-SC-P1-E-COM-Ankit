const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const City = model.city;
const State = model.state;
const Pincode = model.pincode;
const Area = model.area;
const Society = model.society;
const SubCategory = model.sub_category;
const Product = model.product;
const Store = model.store;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	getCity: async function(req,res){
		let nextField = 'pincode';
		let name = req.body.name;
		let label = req.body.label;
		let functionName = req.body.functionName;
		let stateId = req.param('id');
		let data = await City.find({ stateId: mongoose.mongo.ObjectID(stateId), status: true, deletedAt: 0 });
		res.render('admin/ajax/locationfields',{layout:false, data:data, name:name, label: label, functionName:functionName, nextField:nextField } );
	},

	getPincode: async function(req,res){
		let nextField = 'area';
		let name = req.body.name;
		let label = req.body.label;
		let functionName = req.body.functionName;
		let cityId = req.param('id');
		let data = await Pincode.find({ cityId: mongoose.mongo.ObjectID(cityId), status: true, deletedAt: 0 });
		res.render('admin/ajax/locationfields',{layout:false, data:data, name:name, label: label, functionName:functionName, nextField:nextField } );
	},

	getArea: async function(req,res){
		let nextField = 'society';
		let name = req.body.name;
		let label = req.body.label;
		let functionName = req.body.functionName;
		let pincodeId = req.param('id');
		let data = await Area.find({ pincodeId: mongoose.mongo.ObjectID(pincodeId), status: true, deletedAt: 0 });
		res.render('admin/ajax/locationfields',{layout:false, data:data, name:name, label: label, functionName:functionName, nextField:nextField } );
	},

	getSociety: async function(req,res){
		let nextField = 'tower';
		let name = req.body.name;
		let label = req.body.label;
		let functionName = req.body.functionName;
		let areaId = req.param('id');
		let data = await Society.find({ areaId: mongoose.mongo.ObjectID(areaId), status: true, deletedAt: 0 });
		res.render('admin/ajax/locationfields',{layout:false, data:data, name:name, label: label, functionName:functionName, nextField:nextField } );
	},

	getSubcategory: async function(req,res){
		let id = mongoose.mongo.ObjectID(req.body.id);
		let data = await SubCategory.find({categoryId: id, status: true, deletedAt: 0 });
		res.render('admin/ajax/subcategory',{layout:false, data:data} );
	},

	getProduct: async function(req,res){
		let id = mongoose.mongo.ObjectID(req.body.id);
		let data = await Product.find({subcategoryId: id, status: true, deletedAt: 0, offer:"Yes"});
		res.render('admin/ajax/product',{layout:false, data:data} );
	},

	getFilteredStore: async function(req,res){
		const { id } = req.body;
		const data = await Store.find({status:true, deletedAt: 0, _id: { $ne:  mongoose.mongo.ObjectID(id)}});
		res.render('admin/ajax/filteredStore',{layout:false, data } );
	},

	getSubcatByCat: async function(req,res){
		let id = mongoose.mongo.ObjectID(req.body.id);
		let data = await SubCategory.find({categoryId: id, status: true, deletedAt: 0 });
		res.render('admin/ajax/selectOption',{layout:false, data:data} );
	},

	getProductByCatsubcat: async function(req,res){
		let id = mongoose.mongo.ObjectID(req.body.id);
		let fieldName = req.body.fieldName;
		let condition = {status: true, deletedAt: 0, offer:"Yes"};
		if(fieldName == 'categoryId')
		{
			condition.categoryId = id;
		}
		else
		{
			condition.subcategoryId = id;
		}
		let data = await Product.find(condition);
		res.render('admin/ajax/selectOption',{layout:false, data:data} );
	},

	getVarient: async function(req,res){
		let id = mongoose.mongo.ObjectID(req.body.id);
		let data = await Product.aggregate([ 
			{
				$match : {_id: id, status: true, deletedAt: 0}
			},
			{
				$unwind: "$inventory"
			},
			{
				$group: {
					"_id":"$_id",
					"inventory": { $first:"$inventory" },
				}
			}
		])
		console.log(data[0].inventory);
		res.render('admin/ajax/varientOption',{layout:false, data:data[0].inventory} );
	},

	changeOrderStatus: async function(req,res){
		console.log('----id-----', req.body.id);
		// let id = mongoose.mongo.ObjectID(req.body.id);
		// let data = await SubCategory.find({categoryId: id, status: true, deletedAt: 0 });
		// res.render('admin/ajax/selectOption',{layout:false, data:data} );
	},

}