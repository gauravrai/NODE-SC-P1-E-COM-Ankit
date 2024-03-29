const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Varient = model.varient;
const Measurementunit = model.measurementunit;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	manageVarient: async function(req,res){
		let moduleName = 'Varient Management';
		let pageTitle = 'Manage Varient';
		var detail = {};	
		detail = {message:req.flash('msg')};
		await config.helpers.permission('manage_varient', req, (err,permissionData)=>{
			res.render('admin/varient/view',{layout:'admin/layout/layout', pageTitle:pageTitle,moduleName:moduleName, detail:detail, permissionData:permissionData});
		});
    },

    listVarient:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.name = { $regex: '.*' + searchValue + '.*',$options:'i' };
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Varient.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Varient.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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
			await config.helpers.permission('manage_varient', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
					var arr1 = [];
					arr1.push(data[i].label+' '+data[i].measurementUnit);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					if(!data[i].status){
						let change_status = "changeStatus(this,\'1\',\'change_status_varient\',\'list_varient\',\'varient\');";	
						arr1.push('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Inactive</span>');
					}else{
						let change_status = "changeStatus(this,\'0\',\'change_status_varient\',\'list_varient\',\'varient\');";
						arr1.push('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Active</span>');
					}
					let $but_edit = '-';
					if(permissionData.edit=='1'){
					$but_edit = '<span><a href="'+ADMINCALLURL+'/edit_varient?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
					}
					let $but_delete = ' - ';
					if(permissionData.delete =='1'){
						let remove = "deleteData(this,\'delete_varient\',\'list_varient\',\'varient\');";
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

    addVarient: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Varient Management';
			let pageTitle = 'Add Varient';
			let measurementUnitData = await Measurementunit.find({deletedAt: 0, status: true});
			res.render('admin/varient/add',{layout:'admin/layout/layout', pageTitle:pageTitle,moduleName:moduleName, measurementUnitData:measurementUnitData} );
		}else{
			let varientData = {
				label : req.body.label,
				measurementUnit : req.body.measurementUnit
			};
			let varient = new Varient(varientData);
			varient.save(function(err, data){
				if(err){console.log(err)}
				req.flash('msg', {msg:'Varient has been Created Successfully', status:true});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_varient');
				req.flash({});	
			})
		}		
	},
	
    editVarient: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Varient Management';
			let pageTitle = 'Edit Varient';
			let id = req.body.id;
			let measurementUnitData = await Measurementunit.find({deletedAt: 0, status: true});
			let varientData = await Varient.findOne({_id: mongoose.mongo.ObjectId(id), deletedAt: 0});			
			res.render('admin/varient/edit',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, varientData:varientData, measurementUnitData:measurementUnitData} );
		}
		if(req.method == "POST"){
			let varientData = {
				label : req.body.label,
				measurementUnit : req.body.measurementUnit
			};
			await Varient.update(
				{ _id: mongoose.mongo.ObjectId(req.body.id) },
				varientData, function(err,data){
					if(err){console.log(err)}
					req.flash('msg', {msg:'Varient has been Updated Successfully', status:true});	
					res.redirect(config.constant.ADMINCALLURL+'/manage_varient');
					req.flash({});	
			})
		}		
    },
    
    deleteVarient: async function(req,res){
		let id = req.param("id");
		return Varient.updateOne({_id:  mongoose.mongo.ObjectId(id)},{deletedAt:2},function(err,data){        	
			if(err) console.error(err);
        	res.send('done');
        })
	},

    changeStatusVarient: function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return Varient.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatus(this,\'0\',\'change_status_varient\',\'list_varient\',\'varient\');";
				res.send('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatus(this,\'1\',\'change_status_varient\',\'list_varient\',\'varient\');";	
				res.send('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'">Inactive</span>');
			}
	    })
    },
}

