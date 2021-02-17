const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Notification = model.notification;
const Pincode = model.pincode;
const Customer = model.customer;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	manageNotification: async function(req,res){
		let moduleName = 'Notification Management';
		let pageTitle = 'Manage Notification';
		var detail = {};	
		detail = {message:req.flash('msg')};
		await config.helpers.permission('manage_notification', req, (err,permissionData)=>{
			res.render('admin/notification/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, detail:detail, permissionData:permissionData});
		});
	},

	listNotification:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){		
            search.$or = [
				{ name: { $regex: '.*' + searchValue + '.*',$options:'i' } },
				{ email: { $regex: '.*' + searchValue + '.*',$options:'i' } },
				{ username: { $regex: '.*' + searchValue + '.*',$options:'i' } },
			];
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Notification.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Notification.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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
			var perdata = {add:1,edit:1,delete:1}
			await config.helpers.permission('manage_notification', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
					var arr1 = [];
					arr1.push(data[i].message);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					arr1.push(data[i].expiryDate);
					arr1.push(data[i].pincodeType);
					arr1.push(data[i].userType);
				}
				obj.data = arr;
				res.send(obj);
			});
		});
	},

	addNotification: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Notification Management';
			let pageTitle = 'Add Notification';
			let pincodeData = await Pincode.find({status:true, deletedAt: 0});
			let customerData = await Customer.find({status:true, deletedAt: 0});
			res.render('admin/notification/add.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, pincodeData:pincodeData,customerData:customerData} );
		}else{
			let notificationData = {
				pincodeType : req.body.pincodeType,
				pincodeId : req.body.pincodeId ? req.body.pincodeId : [],
				userType : req.body.userType,
				userId : req.body.userId ? req.body.userId : [],
				expiryDate : req.body.expiryDate,
				message : req.body.message,
			};
			let notification = new Notification(notificationData);
			notification.save(function(err, data){
				if(err){console.log(err)}
				req.flash('msg', {msg:'Notification has been Send Successfully', status:true});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_notification');
				req.flash({});	
			})
		}		
	}
}