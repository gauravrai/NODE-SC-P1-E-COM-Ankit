const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Admin = model.admin;
const Role = model.role;
const Store = model.store;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	manageAdministrator: async function(req,res){
		let moduleName = 'Role Management';
		let pageTitle = 'Manage Administrator';
		await config.helpers.permission('manage_administrator', req, (err,permissionData)=>{
			res.render('admin/administrator/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, permissionData:permissionData});
		});
	},

	listAdministrator:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.$or = [
				{ name: { $regex: '.*' + searchValue + '.*',$options:'i' }},
				{ username: { $regex: '.*' + searchValue + '.*',$options:'i' }},
				{ email: { $regex: '.*' + searchValue + '.*',$options:'i' }},
			];
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Admin.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Admin.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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
			await config.helpers.permission('manage_administrator', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
					var arr1 = [];
					arr1.push(data[i].name);
					arr1.push(data[i].email);
					arr1.push(data[i].username);
					await config.helpers.role.getNameById(data[i].roleId, async function (roleName) {
						arr1.push(roleName.name);
						arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
						if(!data[i].status){
							let change_status = "changeStatus(this,\'1\',\'change_status_administrator\',\'list_administrator\',\'administrator\');";	
							arr1.push('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Inactive</span>');
						}else{
							let change_status = "changeStatus(this,\'0\',\'change_status_administrator\',\'list_administrator\',\'administrator\');";
							arr1.push('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Active</span>');
						}
						let $but_edit = '-';
						if(permissionData.edit=='1'){
						$but_edit = '<span><a href="'+ADMINCALLURL+'/edit_administrator?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
						}
						let $but_delete = ' - ';
						if(permissionData.delete =='1'){
							let remove = "deleteData(this,\'delete_administrator\',\'list_administrator\',\'administrator\');";
							$but_delete = '&nbsp;&nbsp;<span><a href="javascript:void(0)" class="btn btn-flat btn-info btn-outline-danger" title="Delete" onclick="'+remove+'" id="'+data[i]._id+'"><i class="fas fa fa-trash" ></i></a></span>';
						}
						arr1.push($but_edit+$but_delete);
						arr.push(arr1);
					});
				}
				obj.data = arr;
				res.send(obj);
			});
		});
	},

	addAdministrator: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Role Management';
			let pageTitle = 'Add Administrator';
			let roleData = await Role.find({status:true, deletedAt: 0});
			let storeData = await Store.find({status:true, deletedAt: 0});
			res.render('admin/administrator/add.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, roleData:roleData,storeData:storeData} );
		}else{
			let adminData = {
				superadmin : false,
				name : req.body.name,
				email : req.body.email,
				username : req.body.username,
				password : bcrypt.hashSync(req.body.password),
				roleId : mongoose.mongo.ObjectId(req.body.roleId),
				storeId : mongoose.mongo.ObjectId(req.body.StoreId)
			};
			let admin = new Admin(adminData);
			admin.save(function(err, data){
				if(err){console.log(err)}
				req.flash('msg', {msg:'Administrator has been Created Successfully', status:false});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_administrator');
				req.flash({});	
			})
		}		
	},

	editAdministrator: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Role Management';
			let pageTitle = 'Edit Administrator';
			let roleData = await Role.find({status:true, deletedAt: 0});
			let storeData = await Store.find({status:true, deletedAt: 0});
			let adminId = req.body.id;
			let administratorData = await Admin.findOne({_id: mongoose.mongo.ObjectId(adminId), status:true});			
			res.render('admin/administrator/edit',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, roleData:roleData, administratorData:administratorData,storeData:storeData} );
		}
		if(req.method == "POST"){
			let administratorData = {
				name : req.body.name,
				email : req.body.email,
				username : req.body.username,
				roleId : mongoose.mongo.ObjectId(req.body.roleId),
				storeId : mongoose.mongo.ObjectId(req.body.StoreId),
			};
			if(req.body.password) {
				administratorData.password = bcrypt.hashSync(req.body.password)
			}
			await Admin.update(
				{ _id: mongoose.mongo.ObjectId(req.body.id) },
				administratorData, function(err,data){
					if(err){console.log(err)}
					req.flash('msg', {msg:'Administrator has been Updated Successfully', status:false});	
					res.redirect(config.constant.ADMINCALLURL+'/manage_administrator');
					req.flash({});	
			})
		}		
	},

	deleteAdministrator: async function(req,res){
		let id = req.param("id");
		return Admin.updateOne({_id:  mongoose.mongo.ObjectId(id)},{deletedAt:2},function(err,data){        	
			if(err) console.error(err);
        	res.send('done');
        })
	},

	changeStatusAdministrator: function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return Admin.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatus(this,\'0\',\'change_status_administrator\',\'list_administrator\',\'administrator\');";
				res.send('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatus(this,\'1\',\'change_status_administrator\',\'list_administrator\',\'administrator\');";	
				res.send('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'">Inactive</span>');
			}
	    })
	}
}