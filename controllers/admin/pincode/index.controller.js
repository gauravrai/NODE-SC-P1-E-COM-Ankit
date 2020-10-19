const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Pincode = model.pincode;
const State = model.state;
const City = model.city;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	managePincode: async function(req,res){
		let moduleName = 'Location Management';
		let pageTitle = 'Manage Pincode';
		await config.helpers.permission('manage_pincode', req, (err,permissionData)=>{
			res.render('admin/pincode/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, permissionData:permissionData});
		});
	},

	listPincode:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.pincode = { $regex: '.*' + searchValue + '.*',$options:'i' };
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Pincode.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Pincode.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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
			await config.helpers.permission('manage_pincode', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
					var arr1 = [];
					await config.helpers.state.getNameById(data[i].stateId, async function (stateName) {
						arr1.push(stateName.name);
					})
					await config.helpers.city.getNameById(data[i].cityId, async function (cityName) {
						arr1.push(cityName.name);
					})
					arr1.push(data[i].pincode);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					if(!data[i].status){
						let change_status = "changeStatus(this,\'1\',\'change_status_pincode\',\'list_pincode\',\'pincode\');";	
						arr1.push('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Inactive</span>');
					}else{
						let change_status = "changeStatus(this,\'0\',\'change_status_pincode\',\'list_pincode\',\'pincode\');";
						arr1.push('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Active</span>');
					}
					let $but_edit = '-';
					if(permissionData.edit=='1'){
					$but_edit = '<span><a href="'+ADMINCALLURL+'/edit_pincode?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
					}
					let $but_delete = ' - ';
					if(permissionData.delete =='1'){
						let remove = "deleteData(this,\'delete_pincode\',\'list_pincode\',\'pincode\');";
						$but_delete = '&nbsp;&nbsp;<span><a href="javascript:void(0)" class="btn btn-flat btn-info btn-outline-danger" title="Delete" onclick="'+remove+'" id="'+data[i]._id+'"><i class="fas fa fa-trash" ></i></a></span>';
					}
					arr1.push($but_edit+$but_delete);
					arr.push(arr1);
				}
				obj.data = arr;
				res.send(obj);
			});
		});
	},

	addPincode: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Location Management';
			let pageTitle = 'Add Pincode';
			let stateData = await State.find({status: true, deletedAt: 0});	
			res.render('admin/pincode/add.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, stateData:stateData} );
		}else{
			let pincodeData = {
				shippingCharges: req.body.shippingCharges,
				pincode : req.body.pincode,
				stateId : mongoose.mongo.ObjectId(req.body.stateId),
				cityId : mongoose.mongo.ObjectId(req.body.cityId)
			};
			console.log(pincodeData);
			let pincode = new Pincode(pincodeData);
			pincode.save(function(err, data){
				if(err){console.log(err)}
				req.flash('msg', {msg:'Pincode has been Created Successfully', status:false});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_pincode');
				req.flash({});	
			})
		}		
	},

	editPincode: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Location Management';
			let pageTitle = 'Edit Pincode';
			let id = req.body.id;
			let pincodeData = await Pincode.findOne({_id: mongoose.mongo.ObjectId(id), status: true, deletedAt: 0});	
			let stateData = await State.find({status: true, deletedAt: 0});	
			let cityData = await City.find({stateId: mongoose.mongo.ObjectId(pincodeData.stateId),status: true, deletedAt: 0});			
			res.render('admin/pincode/edit',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, stateData:stateData, cityData:cityData, pincodeData:pincodeData} );
		}
		if(req.method == "POST"){
			let pincodeData = {
				shippingCharges: req.body.shippingCharges,
				pincode : req.body.pincode,
				stateId : mongoose.mongo.ObjectId(req.body.stateId),
				cityId : mongoose.mongo.ObjectId(req.body.cityId)
			};
			await Pincode.update(
				{ _id: mongoose.mongo.ObjectId(req.body.id) },
				pincodeData, function(err,data){
					if(err){console.log(err)}
					req.flash('msg', {msg:'Pincode has been Updated Successfully', status:false});	
					res.redirect(config.constant.ADMINCALLURL+'/manage_pincode');
					req.flash({});	
			})
		}		
	},

	deletePincode: async function(req,res){
		let id = req.param("id");
		return Pincode.updateOne({_id:  mongoose.mongo.ObjectId(id)},{deletedAt:2},function(err,data){        	
			if(err) console.error(err);
        	res.send('done');
        })
	},

	changeStatusPincode: function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return Pincode.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatus(this,\'0\',\'change_status_pincode\',\'list_pincode\',\'pincode\');";
				res.send('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatus(this,\'1\',\'change_status_pincode\',\'list_pincode\',\'pincode\');";	
				res.send('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'">Inactive</span>');
			}
	    })
	},
}