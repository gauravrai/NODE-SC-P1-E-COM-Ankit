const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Brand = model.brand;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	manageBrand: async function(req,res){
		let moduleName = 'Brand Management';
		let pageTitle = 'Manage Brand';
		await config.helpers.permission('manage_brand', req, (err,permissionData)=>{
			res.render('admin/brand/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle,moduleName:moduleName,permissionData:permissionData});
		});
    },

    listBrand:function(req,res){
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
		        Brand.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Brand.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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
			await config.helpers.permission('manage_brand', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
					var arr1 = [];
					arr1.push(data[i].name);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					if(!data[i].status){
						let change_status = "changeStatus(this,\'1\',\'change_status_brand\',\'list_brand\',\'brand\');";	
						arr1.push('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Inactive</span>');
					}else{
						let change_status = "changeStatus(this,\'0\',\'change_status_brand\',\'list_brand\',\'brand\');";
						arr1.push('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Active</span>');
					}
					let $but_edit = '-';
					if(permissionData.edit=='1'){
					$but_edit = '<span><a href="'+ADMINCALLURL+'/edit_brand?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
					}
					let $but_delete = ' - ';
					if(permissionData.delete =='1'){
						let remove = "deleteData(this,\'delete_brand\',\'list_brand\',\'brand\');";
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
    addBrand: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Brand Management';
			let pageTitle = 'Add Brand';
			res.render('admin/brand/add.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle,moduleName:moduleName} );
		}else{
			let brandData = {
				name : req.body.name,
			};
			//console.log(categoryData);
			let brandobj = new Brand(brandData);
			brandobj.save(function(err, data){
				if(err){console.log(err)}
				req.flash('msg', {msg:'Brand has been Created Successfully', status:false});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_brand');
				req.flash({});	
			})
		}		
    },
    editBrand: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Brand Management';
			let pageTitle = 'Edit Brand';
			let id = req.body.id;
			let brandData = await Brand.findOne({_id: mongoose.mongo.ObjectId(id), deletedAt: 0});			
			res.render('admin/brand/edit',{layout:'admin/layout/layout', pageTitle:pageTitle,moduleName:moduleName,brandData:brandData} );
		}
		if(req.method == "POST"){
			let brandData = {
				name : req.body.name
			};
			await Brand.update(
				{ _id: mongoose.mongo.ObjectId(req.body.id) },
				brandData, function(err,data){
					if(err){console.log(err)}
					req.flash('msg', {msg:'Brand has been Updated Successfully', status:false});	
					res.redirect(config.constant.ADMINCALLURL+'/manage_brand');
					req.flash({});	
			})
		}		
    },
    changeStatusBrand : function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return Brand.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatus(this,\'0\',\'change_status_brand\',\'list_brand\',\'brand\');";
				res.send('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatus(this,\'1\',\'change_status_brand\',\'list_brand\',\'brabd\');";	
				res.send('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'">Inactive</span>');
			}
	    })
    },
    
    deleteBrand : async function(req,res){
		let id = req.param("id");
		return Brand.deleteOne({_id:  mongoose.mongo.ObjectId(id)},function(err,data){        	
			if(err) console.error(err);
        	res.send('done');
        })
	},
}

