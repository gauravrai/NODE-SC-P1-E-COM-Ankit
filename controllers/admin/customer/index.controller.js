const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Admin = model.admin;
const Category = model.category;
const SubCategory = model.sub_category;
const Store = model.store;
const State = model.state;
const City = model.city;
const Pincode = model.pincode;
const Area = model.area;
const Society = model.society;
const Tower = model.tower;
const Product = model.product;
const Brand   = model.brand;
const ADMINCALLURL = config.constant.ADMINCALLURL;
const Customer = model.customer;

module.exports = {

    manageCustomer: async function(req,res){
		let moduleName = 'Customer Management';
        let pageTitle = 'Manage Customer';
		await config.helpers.permission('manage_customer', req, (err,permissionData)=>{
			res.render('admin/customer/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, permissionData:permissionData});
		});
	},
	listCustomer: async function(req,res) {
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.name = { $regex: '.*' + searchValue + '.*',$options:'i' };
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Customer.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Customer.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
		        	callback(null,data)
		        })		        
		    }
		},		
		async function(err, results) {
		   	var obj = {};
			obj.draw = req.body.draw;
			obj.recordsTotal = results.count?results.count:0;
			obj.recordsFiltered =results.count?results.count:0;
			var data = results.data?results.data:[];
			var arr =[];
			await config.helpers.permission('manage_customer', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
					var arr1 = [];
					arr1.push(data[i].name);
					arr1.push(data[i].email);
					arr1.push(data[i].mobile);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					if(!data[i].status){
						let change_status = "changeStatus(this,\'1\',\'change_status_customer\',\'list_customer\',\'customer\');";	
						arr1.push('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Inactive</span>');
					}else{
						let change_status = "changeStatus(this,\'0\',\'change_status_customer\',\'list_customer\',\'customer\');";
						arr1.push('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Active</span>');
					}
					let $but_view = '<span><a href="'+ADMINCALLURL+'/view_customer_dashboard?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-success" title="View Dashboard"><i class="fas fa-tachometer-alt"></i></a></span>';
					let $but_edit = '-';
					if(permissionData.edit=='1'){
					$but_edit = '&nbsp;&nbsp;<span><a href="'+ADMINCALLURL+'/edit_customer?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
					}
					// ** delete customer functionality removed for now.
					// let $but_delete = ' - ';
					// if(permissionData.delete =='1'){
					// 	let remove = "deleteData(this,\'delete_customer\',\'list_customer\',\'customer\');";
					// 	$but_delete = '&nbsp;&nbsp;<span><a href="javascript:void(0)" class="btn btn-flat btn-info btn-outline-danger" title="Delete" onclick="'+remove+'" id="'+data[i]._id+'"><i class="fas fa fa-trash" ></i></a></span>';
					// }
					arr1.push($but_view + $but_edit);
					arr.push(arr1);
				}
				obj.data = arr;
				res.send(obj);
			});
		});
	},
    addCustomer: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Customer Management';
			let pageTitle = 'Add Customer';
			const stateData = await State.find({status: true, deletedAt: 0});	
			res.render('admin/customer/add.ejs',{layout:'admin/layout/layout', pageTitle, moduleName, stateData });
        }
        if (req.method === 'POST') {
			let { name, email, mobile, sameAsBillingAddress, gst, billingAddress, billingCountry, billingState, billingCityId, billingPincodeId, billingAreaId, billingSocietyId, billingTowerId, shippingAddress, shippingCountry, shippingState, shippingCityId, shippingPincodeId, shippingAreaId, shippingSocietyId, shippingTowerId } = req.body;
			
			let billingAddressData = {
				address: billingAddress ? billingAddress : '',
				country: billingCountry ? billingCountry : '',
				state: billingState ? mongoose.mongo.ObjectId(billingState) : '',
				city: billingCityId ? mongoose.mongo.ObjectId(billingCityId) : '',
				pincode: billingPincodeId ? mongoose.mongo.ObjectId(billingPincodeId) : '',
				area: billingAreaId ? mongoose.mongo.ObjectId(billingAreaId) : '',
				society: billingSocietyId ? mongoose.mongo.ObjectId(billingSocietyId) : '',
				tower: billingTowerId ? mongoose.mongo.ObjectId(billingTowerId) : ''
			};

			sameAsBillingAddress = sameAsBillingAddress == 'on' ? true : false;
			let shippingAddressData = {};
			if(sameAsBillingAddress) {
				shippingAddressData = {
					address: billingAddress ? billingAddress : '',
					country: billingCountry ? billingCountry : '',
					state: billingState ? mongoose.mongo.ObjectId(billingState) : '',
					city: billingCityId ? mongoose.mongo.ObjectId(billingCityId) : '',
					pincode: billingPincodeId ? mongoose.mongo.ObjectId(billingPincodeId) : '',
					area: billingAreaId ? mongoose.mongo.ObjectId(billingAreaId) : '',
					society: billingSocietyId ? mongoose.mongo.ObjectId(billingSocietyId) : '',
					tower: billingTowerId ? mongoose.mongo.ObjectId(billingTowerId) : ''
				};
			}else {
				shippingAddressData = {
					address: shippingAddress ? shippingAddress : '',
					country: shippingCountry ? shippingCountry : '',
					state: shippingState ? mongoose.mongo.ObjectId(shippingState) : '',
					city: shippingCityId ? mongoose.mongo.ObjectId(shippingCityId) : '',
					pincode: shippingPincodeId ? mongoose.mongo.ObjectId(shippingPincodeId) : '',
					area: shippingAreaId ? mongoose.mongo.ObjectId(shippingAreaId) : '',
					society: shippingSocietyId ? mongoose.mongo.ObjectId(shippingSocietyId) : '',
					tower: shippingTowerId ? mongoose.mongo.ObjectId(shippingTowerId) : ''
				};
			}
            const customerData = {
                name: name,
                email: email,
				mobile: mobile,
				sameAsBillingAddress: sameAsBillingAddress,
				billingAddress: billingAddressData,
				shippingAddress: shippingAddressData
			};

			const customer = new Customer(customerData);
			customer.save(function(err, data){
				if(err){console.log(err)}
				req.flash('msg', {msg:'Customer has been added Successfully', status:false});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_customer');
				req.flash({});	
            })
        }
	},

	changeStatusCustomer: function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return Customer.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatus(this,\'0\',\'change_status_customer\',\'list_customer\',\'customer\');";
				res.send('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatus(this,\'1\',\'change_status_customer\',\'list_customer\',\'customer\');";	
				res.send('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'">Inactive</span>');
			}
	    })
	},

	deleteCustomer : async function(req,res){
		const id = req.param("id");
		return Customer.updateOne({_id:  mongoose.mongo.ObjectId(id)},{deletedAt:2},function(err,data){        	
			if(err) console.error(err);
        	res.send('done');
        })
	},
	
	editCustomer: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Customer Management';
			let pageTitle = 'Edit Customer';
			let id = req.body.id;
			let customerData = await Customer.findOne({_id: mongoose.mongo.ObjectId(id), deletedAt: 0 });	
			let stateData = await State.find({status: true, deletedAt: 0});	
			let cityData = await City.find({status: true, deletedAt: 0});	
			let pincodeData = await Pincode.find({status: true, deletedAt: 0});	
			let areaData = await Area.find({status: true, deletedAt: 0});	
			let societyData = await Society.find({status: true, deletedAt: 0});	
			let towerData = await Tower.find({status: true, deletedAt: 0});		
			res.render('admin/customer/edit',{layout:'admin/layout/layout', pageTitle, moduleName, stateData, cityData, pincodeData, areaData, customerData, societyData, towerData } );
		}
		if(req.method == "POST"){
			let { name, email, mobile, sameAsBillingAddress, gst, billingAddress, billingCountry, billingState, billingCityId, billingPincodeId, billingAreaId, billingSocietyId, billingTowerId, shippingAddress, shippingCountry, shippingState, shippingCityId, shippingPincodeId, shippingAreaId, shippingSocietyId, shippingTowerId } = req.body;
			
			let billingAddressData = {
				address: billingAddress ? billingAddress : '',
				country: billingCountry ? billingCountry : '',
				state: billingState ? mongoose.mongo.ObjectId(billingState) : '',
				city: billingCityId ? mongoose.mongo.ObjectId(billingCityId) : '',
				pincode: billingPincodeId ? mongoose.mongo.ObjectId(billingPincodeId) : '',
				area: billingAreaId ? mongoose.mongo.ObjectId(billingAreaId) : '',
				society: billingSocietyId ? mongoose.mongo.ObjectId(billingSocietyId) : '',
				tower: billingTowerId ? mongoose.mongo.ObjectId(billingTowerId) : ''
			};

			sameAsBillingAddress = sameAsBillingAddress == 'on' ? true : false;
			let shippingAddressData = {};
			if(sameAsBillingAddress) {
				shippingAddressData = {
					address: billingAddress ? billingAddress : '',
					country: billingCountry ? billingCountry : '',
					state: billingState ? mongoose.mongo.ObjectId(billingState) : '',
					city: billingCityId ? mongoose.mongo.ObjectId(billingCityId) : '',
					pincode: billingPincodeId ? mongoose.mongo.ObjectId(billingPincodeId) : '',
					area: billingAreaId ? mongoose.mongo.ObjectId(billingAreaId) : '',
					society: billingSocietyId ? mongoose.mongo.ObjectId(billingSocietyId) : '',
					tower: billingTowerId ? mongoose.mongo.ObjectId(billingTowerId) : ''
				};
			}else {
				shippingAddressData = {
					address: shippingAddress ? shippingAddress : '',
					country: shippingCountry ? shippingCountry : '',
					state: shippingState ? mongoose.mongo.ObjectId(shippingState) : '',
					city: shippingCityId ? mongoose.mongo.ObjectId(shippingCityId) : '',
					pincode: shippingPincodeId ? mongoose.mongo.ObjectId(shippingPincodeId) : '',
					area: shippingAreaId ? mongoose.mongo.ObjectId(shippingAreaId) : '',
					society: shippingSocietyId ? mongoose.mongo.ObjectId(shippingSocietyId) : '',
					tower: shippingTowerId ? mongoose.mongo.ObjectId(shippingTowerId) : ''
				};
			}

			const customerData = {
                name: name,
                email: email,
				mobile: mobile,
				sameAsBillingAddress: sameAsBillingAddress,
				billingAddress: billingAddressData,
				shippingAddress: shippingAddressData
			};
			await Customer.updateOne(
				{ _id: mongoose.mongo.ObjectId(req.body.id) },
				customerData, function(err,data){
					if(err){console.log(err)}
					req.flash('msg', {msg:'Customer has been Updated Successfully', status:false});	
					res.redirect(config.constant.ADMINCALLURL+'/manage_customer');
					req.flash({});	name
			})
		}		
	},
    viewCustomerDashboard: async function(req,res){
		let moduleName = 'Customer Management';
        let pageTitle = 'Customer Dashboard';
		res.render('admin/customer/customerdashboard.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName});
	},
};

