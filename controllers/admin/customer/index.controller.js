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
    addCustomer: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Customer Management';
			let pageTitle = 'Add Customer';
			const stateData = await State.find({status: true, deletedAt: 0});	
			res.render('admin/customer/add.ejs',{layout:'admin/layout/layout', pageTitle, moduleName, stateData });
        }
        if (req.method === 'POST') {
            const { name, email, mobile, stateId, cityId, pincodeId, areaId, societyId, address } = req.body;
            // TODO: look for the tower id.
            const customerData = {
                name,
                email,
                mobile,
                address,
                stateId : mongoose.mongo.ObjectId(stateId),
				cityId : mongoose.mongo.ObjectId(cityId),
				pincodeId : mongoose.mongo.ObjectId(pincodeId),
				areaId : mongoose.mongo.ObjectId(areaId),
				societyId : mongoose.mongo.ObjectId(societyId),
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
};

