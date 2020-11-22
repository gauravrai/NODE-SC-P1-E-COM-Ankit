const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require("mongoose");
const moment = require('moment');
const Role = model.role;
const Menu = model.menu;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	manageRole: async function(req,res){
		let moduleName = 'Role Management';
		let pageTitle = 'Manage Role';
		await config.helpers.permission('manage_role', req, (err,permissionData)=>{
			res.render('admin/role/view',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, permissionData:permissionData} );
		});
	},

	listRole:function(req,res){

		let search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.name = { $regex: '.*' + searchValue + '.*',$options:'i' }
		}

		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Role.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Role.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
		        	callback(null,data)
		        })		        
		    }
		},		
		async function(err, results) {
		   	let obj = {};
			obj.draw = req.body.draw;
			obj.recordsTotal = results.count?results.count:0;
			obj.recordsFiltered =results.count?results.count:0;
			let data = results.data?results.data:[];
			let arr =[];
			let perdata = {add:1,edit:1,delete:1}
			await config.helpers.permission('manage_role', req, (err,permissionData)=>{
				for(i=0;i<data.length;i++){
					let arr1 = [];
					arr1.push(data[i].name);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					if(!data[i].status){
						let change_status = "changeStatus(this,\'1\',\'change_status_role\',\'list_role\',\'role\');";	
						arr1.push('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Inactive</span>');
					}else{
						let change_status = "changeStatus(this,\'0\',\'change_status_role\',\'list_role\',\'role\');";
						arr1.push('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Active</span>');
					}
					let $but_edit = '-';
					if(permissionData.edit=='1'){
					$but_edit = '<span><a href="'+ADMINCALLURL+'/edit_role?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
					}
					let $but_delete = ' - ';
					if(permissionData.delete =='1'){
						let remove = "deleteData(this,\'delete_role\',\'list_role\',\'role\');";
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

	addRole: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Role Management';
			let pageTitle = 'Add Role 1';
			let menuData = await Menu.find({status:true, deletedAt: 0}).sort({order: 1});
			res.render('admin/role/add',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, menuData:menuData} );
		}
		if(req.method == "POST"){
			let menuCheck = req.body.menuCheck;
			let arrayData = [];
			for (let key in menuCheck) {
				if (typeof menuCheck[key] == "string") {
					let obj = {
						"id": menuCheck[key],
						"add": req.body["menuCheck_"+menuCheck[key]+"_add"]?req.body["menuCheck_"+menuCheck[key]+"_add"]:'1',
						"edit": req.body["menuCheck_"+menuCheck[key]+"_edit"]?req.body["menuCheck_"+menuCheck[key]+"_edit"]:'0',
						"delete": req.body["menuCheck_"+menuCheck[key]+"_delete"]?req.body["menuCheck_"+menuCheck[key]+"_delete"]:'0',
					};
					arrayData.push(obj);
				}
				else if(typeof menuCheck[key] == "object"){
					for (let i = 0; i < menuCheck[key].length; i++) {
						let obj = {
							"id": menuCheck[key][i],
							"add": req.body["menuCheck_"+menuCheck[key][i]+"_add"]?req.body["menuCheck_"+menuCheck[key][i]+"_add"]:'0',
							"edit": req.body["menuCheck_"+menuCheck[key][i]+"_edit"]?req.body["menuCheck_"+menuCheck[key][i]+"_edit"]:'0',
							"delete": req.body["menuCheck_"+menuCheck[key][i]+"_delete"]?req.body["menuCheck_"+menuCheck[key][i]+"_delete"]:'0',
						};
						arrayData.push(obj);
					}
				}
			}
			let roleData = {
				name : req.body.name,
				description : req.body.description,
				permission : arrayData
			};
			let role = new Role(roleData);
			role.save(function(err, data){
				if(err){console.log(err)}
				req.flash('msg', {msg:'Role has been Created Successfully', status:false});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_role');
			})
		}		
	},

	editRole: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Role Management';
			let pageTitle = 'Edit Role';
			let menuData = await Menu.find({status:true, deletedAt: 0}).sort({order: 1});
			let id = req.body.id;
			let roleData = await Role.findOne({_id: mongoose.mongo.ObjectId(id), deletedAt: 0});
			let permission = roleData.permission;
			for (let i = 0; i < menuData.length; i++) {
				for(let j=0;j<permission.length;j++){
					if (menuData[i].id == permission[j].id) {
						menuData[i].add = permission[j].add;
						menuData[i].delete = permission[j].delete;
						menuData[i].edit = permission[j].edit;
					}

					if(menuData[i].submenu && menuData[i].submenu.length) {
						for(let k=0;k<menuData[i].submenu.length;k++){
							if (menuData[i].submenu[k].id == permission[j].id) {
									menuData[i].submenu[k].add = permission[j].add;
									menuData[i].submenu[k].delete = permission[j].delete;
									menuData[i].submenu[k].edit = permission[j].edit;
								}
						}
					}
				}
			}
			res.render('admin/role/edit',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, menuData:menuData, roleData:roleData} );
		}
		if(req.method == "POST"){
			let menuCheck = req.body.menuCheck;
			let arrayData = [];
			for (let key in menuCheck) {
				if (typeof menuCheck[key] == "string") {
					let obj = {
						"id": menuCheck[key],
						"add": req.body["menuCheck_"+menuCheck[key]+"_add"]?req.body["menuCheck_"+menuCheck[key]+"_add"]:'1',
						"edit": req.body["menuCheck_"+menuCheck[key]+"_edit"]?req.body["menuCheck_"+menuCheck[key]+"_edit"]:'0',
						"delete": req.body["menuCheck_"+menuCheck[key]+"_delete"]?req.body["menuCheck_"+menuCheck[key]+"_delete"]:'0',
					};
					arrayData.push(obj);
				}
				else if(typeof menuCheck[key] == "object"){
					for (let i = 0; i < menuCheck[key].length; i++) {
						let obj = {
							"id": menuCheck[key][i],
							"add": req.body["menuCheck_"+menuCheck[key][i]+"_add"]?req.body["menuCheck_"+menuCheck[key][i]+"_add"]:'0',
							"edit": req.body["menuCheck_"+menuCheck[key][i]+"_edit"]?req.body["menuCheck_"+menuCheck[key][i]+"_edit"]:'0',
							"delete": req.body["menuCheck_"+menuCheck[key][i]+"_delete"]?req.body["menuCheck_"+menuCheck[key][i]+"_delete"]:'0',
						};
						arrayData.push(obj);
					}
				}
			} 
			let roleData = {
				name : req.body.name,
				description : req.body.description,
				permission : arrayData
			};
			await Role.updateOne(
				{ _id: mongoose.mongo.ObjectId(req.body.id) },
				roleData, function(err,data){
					if(err){console.log(err)}
					req.flash('msg', {msg:'Role has been Updated Successfully', status:false});	
					res.redirect(config.constant.ADMINCALLURL+'/manage_role');
			})
		}		
	},

	deleteRole: async function(req,res){
		let id = req.param("id");
		return Role.updateOne({_id:  mongoose.mongo.ObjectId(id)},{deletedAt:2},function(err,data){        	
			 	if(err) console.error(err);
			 	res.send('done');
	    })
	},

	changeStatusRole: function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return Role.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatus(this,\'0\',\'change_status_role\',\'list_role\',\'role\');";
				res.send('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatus(this,\'1\',\'change_status_role\',\'list_role\',\'role\');";	
				res.send('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'">Inactive</span>');
			}
	    })
	}
}