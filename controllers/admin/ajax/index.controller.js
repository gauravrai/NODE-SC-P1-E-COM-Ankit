const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const City = model.city;
const State = model.state;
const Store = model.store;
const Pincode = model.pincode;
const Area = model.area;
const Society = model.society;
const SubCategory = model.sub_category;
const Product = model.product;
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
		console.log(data);
		res.render('admin/ajax/product',{layout:false, data:data} );
	},

	getStoreAndVariant: async function(req,res){
		const { id, productId } = req.body;
		const storeData = await Store.find({status:true, deletedAt: 0, _id: { $ne:  mongoose.mongo.ObjectID(id)}});
		let variantData = [];
		if ( productId) {
			const productData = await Product.find({_id: mongoose.mongo.ObjectID(productId), status: true, deletedAt: 0 });
			const { inventory } = productData[0];
			inventory.forEach((inventoryData) => {
				inventoryData.forEach((storeData) => {
					if (storeData.storeId.toString() === id) { 
						variantData.push(storeData)}
				})
			});
		}
		res.render('admin/ajax/toStoreAndVariant',{layout:false, data: { storeData, variantData } } );
	},
}