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
		let societyId = req.param('id');
		let data = await Society.find({ societyId: mongoose.mongo.ObjectID(societyId), status: true, deletedAt: 0 });
		res.render('admin/ajax/locationfields',{layout:false, data:data, name:name, label: label, functionName:functionName, nextField:nextField } );
	}
}