const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Category = model.category;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	manageCategory: async function(req,res){
		let moduleName = 'Category Management';
		let pageTitle = 'Manage Category';
		await config.helpers.permission('manage_category', req, (err,permissionData)=>{
			res.render('admin/category/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle,moduleName:moduleName,permissionData:permissionData});
		});
	},

	listCategory:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.$or = [
				{ name: { $regex: '.*' + searchValue + '.*',$options:'i' }},
				{ slug: { $regex: '.*' + searchValue + '.*',$options:'i' }}
			];
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Category.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Category.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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
			await config.helpers.permission('manage_category', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
					var arr1 = [];
					arr1.push(data[i].name);
					arr1.push(data[i].slug);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					if(!data[i].status){
						let change_status = "changeStatus(this,\'1\',\'change_status_category\',\'list_category\',\'category\');";	
						arr1.push('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Inactive</span>');
					}else{
						let change_status = "changeStatus(this,\'0\',\'change_status_category\',\'list_category\',\'category\');";
						arr1.push('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Active</span>');
					}
					let $but_edit = '-';
					if(permissionData.edit=='1'){
					$but_edit = '<span><a href="'+ADMINCALLURL+'/edit_category?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
					}
					let $but_delete = ' - ';
					if(permissionData.delete =='1'){
						let remove = "deleteData(this,\'delete_category\',\'list_category\',\'category\');";
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

	addCategory: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Category Management';
			let pageTitle = 'Add Category';
			res.render('admin/category/add.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle,moduleName:moduleName} );
		}else{
			let categoryData = {
				name : req.body.name,
				slug : req.body.slug,
				order: req.body.order
			};
			let categoryobj = new Category(categoryData);
			categoryobj.save(function(err, data){
				if(err){console.log(err)}
				req.flash('msg', {msg:'Category has been Created Successfully', status:false});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_category');
				req.flash({});	
			})
		}		
	},

	editCategory: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Category Management';
			let pageTitle = 'Edit Category';
			let id = req.body.id;
			let categoryData = await Category.findOne({_id: mongoose.mongo.ObjectId(id), deletedAt: 0});			
			res.render('admin/category/edit',{layout:'admin/layout/layout', pageTitle:pageTitle,moduleName:moduleName,categoryData:categoryData} );
		}
		if(req.method == "POST"){
			let categoryData = {
				name : req.body.name,
				slug : req.body.slug,
				order: req.body.order
			};
			await Category.update(
				{ _id: mongoose.mongo.ObjectId(req.body.id) },
				categoryData, function(err,data){
					if(err){console.log(err)}
					req.flash('msg', {msg:'Category has been Updated Successfully', status:false});	
					res.redirect(config.constant.ADMINCALLURL+'/manage_category');
					req.flash({});	
			})
		}		
	},

	deleteCategory : async function(req,res){
		let id = req.param("id");
		return Category.updateOne({_id:  mongoose.mongo.ObjectId(id)},{deletedAt:2},function(err,data){        	
			if(err) console.error(err);
        	res.send('done');
        })
	},

	changeStatusCategory : function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return Category.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatus(this,\'0\',\'change_status_category\',\'list_category\',\'category\');";
				res.send('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatus(this,\'1\',\'change_status_category\',\'list_category\',\'category\');";	
				res.send('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'">Inactive</span>');
			}
	    })
	},
	
	checkSlugCategory: function(req,res){
		var slug = req.body.slug;
		var id = req.body.id;
		var search = {deletedAt:0,slug:slug};
		if(id){
			search._id = {$ne:id}
		}
		Category.find(search).exec(function(err,categoryData){
			if(categoryData.length > 0){
				res.send('OK');
			}else{
				res.send();
			}
		})
	}
}