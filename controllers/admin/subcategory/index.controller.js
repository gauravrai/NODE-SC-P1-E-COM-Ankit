const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Category = model.category;
const SubCategory = model.sub_category;
const ADMINCALLURL = config.constant.ADMINCALLURL;


module.exports = {
    manageSubCategory: async function(req,res){
		let moduleName = 'Sub Category Management';
		let pageTitle = 'Manage Sub Category';
		await config.helpers.permission('manage_subcategory', req, (err,permissionData)=>{
			res.render('admin/subcategory/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle,moduleName:moduleName,permissionData:permissionData});
		});
	},
	
    listSubCategory:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.name = { $regex: '.*' + searchValue + '.*',$options:'i' };
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        SubCategory.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	SubCategory.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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
			//console.log(data); return false;
			var arr =[];
            var perdata = {add:1,edit:1,delete:1}
            //console.log(data);
			await config.helpers.permission('manage_subcategory', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
                    var arr1 = [];
                    arr1.push(data[i].name);
					await config.helpers.category.getNameById(data[i].categoryId, async function (categoryName) {
						var cat_name = categoryName ? categoryName.name : 'N/A';
						//console.log(categoryName.name);return false;
						//arr1.push(categoryName.name);
						arr1.push(cat_name);
                    })
					arr1.push(data[i].slug);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					if(!data[i].status){
						let change_status = "changeStatus(this,\'1\',\'change_status_subcategory\',\'list_subcategory\',\'subcategory\');";	
						arr1.push('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Inactive</span>');
					}else{
						let change_status = "changeStatus(this,\'0\',\'change_status_subcategory\',\'list_subcategory\',\'subcategory\');";
						arr1.push('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Active</span>');
					}
					let $but_edit = '-';
					if(permissionData.edit=='1'){
					$but_edit = '<span><a href="'+ADMINCALLURL+'/edit_subcategory?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
					}
					let $but_delete = ' - ';
					if(permissionData.delete =='1'){
						let remove = "deleteData(this,\'delete_subcategory\',\'list_subcategory\',\'subcategory\');";
						$but_delete = '&nbsp;&nbsp;<span><a href="javascript:void(0)" class="btn btn-flat btn-info btn-outline-danger" title="Delete" onclick="'+remove+'" id="'+data[i]._id+'"><i class="fas fa fa-trash" ></i></a></span>';
					}
					arr1.push($but_edit+$but_delete);
					arr.push(arr1);
                }
                //console.log(arr);
				obj.data = arr;
				res.send(obj);
			});
		});
	},

    addSubCategory: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Sub Category Management';
            let pageTitle = 'Add Sub Category';
            let categoryData = await Category.find({status: true, deletedAt: 0});
            //console.log(categoryData);
			res.render('admin/subcategory/add.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle,moduleName:moduleName,categoryData:categoryData} );
		}else{
			let subcategoryData = {
                name : req.body.name,
                categoryId: req.body.categoryId,
				slug : req.body.slug,
				order: req.body.order
			};
			let  image = {};
			new Promise(function(resolve, reject) { 
				let thumbnailPath = config.constant.SUBCATEGORYTHUMBNAILUPLOADPATH;
				let thumbnailName = Date.now()+'_'+req.files.thumbnail.name;
                image.thumbnail = thumbnailName;
                req.files.thumbnail.mv(thumbnailPath+thumbnailName, function(err,data) {
                    if (err) { 
                        console.log(err)
                        reject(err); 
                    } else {  
                        resolve();
                    }
                })
			}).then(async () => { 
				new Promise(function(resolve1, reject1) { 
					let smallPath = config.constant.SUBCATEGORYSMALLUPLOADPATH;
                    let smallName = Date.now()+'_'+req.files.small.name;
                    image.small = smallName;
                    req.files.small.mv(smallPath+smallName, function(err,data) {
                        if (err) { 
                            console.log(err)
                            reject1(err); 
                        } else {  
                            resolve1();
                        }
                    })
				}).then(async () => { 
					new Promise(function(resolve2, reject2) {
						let largePath = config.constant.SUBCATEGORYLARGEUPLOADPATH;
                        let largeName = Date.now()+'_'+req.files.large.name;
                        image.large = largeName;
                        req.files.large.mv(largePath+largeName, function(err,data) {
                            if (err) { 
                                console.log(err)
                                reject2(err); 
                            } else {  
                                resolve2();
                            }
                        })
					}).then(async () => { 
						subcategoryData.image = image;
						let subcategory = new SubCategory(subcategoryData);
						subcategory.save(function(err, data){
							if(err){console.log(err)}
							req.flash('msg', {msg:'Sub Category has been Created Successfully', status:false});	
							res.redirect(config.constant.ADMINCALLURL+'/manage_subcategory');
							req.flash({});	
						})
					})
				})
			}).catch((err) => {
				console.log(err);
			});
		}		
	},
	
    editSubCategory: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Sub Category Management';
			let pageTitle = 'Edit Sub Category';
			let id = req.body.id;
			let subcategoryData = await SubCategory.findOne({_id: mongoose.mongo.ObjectId(id), status: true, deletedAt: 0});	
			let categoryData = await Category.find({status: true, deletedAt: 0});			
			res.render('admin/subcategory/edit',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName,categoryData:categoryData, subcategoryData:subcategoryData} );
		}
		if(req.method == "POST"){
			let subcategoryData = {
				name : req.body.name,
				categoryId : mongoose.mongo.ObjectId(req.body.categoryId),
				slug   : req.body.slug,
				order: req.body.order
			};
			if(Object.keys(req.files).length !== 0)
			{
				let image = {}
				new Promise(function(resolve, reject) { 
					if(typeof req.files.thumbnail != 'undefined')
					{
						let thumbnailPath = config.constant.SUBCATEGORYTHUMBNAILUPLOADPATH;
						let thumbnailName = Date.now()+'_'+req.files.thumbnail.name;
						image.thumbnail = thumbnailName;
						req.files.thumbnail.mv(thumbnailPath+thumbnailName, function(err,data) {
							if (err) { 
								console.log(err)
								reject(err); 
							} else {  
								resolve();
							}
						})
					}
					else
					{
						image.thumbnail = req.body.thumbnailhidden
					}
				}).then(async () => { 
					new Promise(function(resolve1, reject1) { 
						if(typeof req.files.small != 'undefined')
						{
							let smallPath = config.constant.SUBCATEGORYSMALLUPLOADPATH;
							let smallName = Date.now()+'_'+req.files.small.name;
							image.small = smallName;
							req.files.small.mv(smallPath+smallName, function(err,data) {
								if (err) { 
									console.log(err)
									reject1(err); 
								} else {  
									resolve1();
								}
							})
						}
						else
						{
							image.small = req.body.smallhidden
						}
					}).then(async () => { 
						new Promise(function(resolve2, reject2) {
							if(typeof req.files.large != 'undefined')
							{
								let largePath = config.constant.SUBCATEGORYLARGEUPLOADPATH;
								let largeName = Date.now()+'_'+req.files.large.name;
								image.large = largeName;
								req.files.large.mv(largePath+largeName, function(err,data) {
									if (err) { 
										console.log(err)
										reject2(err); 
									} else {  
										resolve2();
									}
								})
							}
							else
							{
								image.large = req.body.largehidden
							}
						}).then(async () => { 
							let data = {
								image : image
							}
							await SubCategory.updateOne(
								{ _id: mongoose.mongo.ObjectId(req.body.id) },
								data, function(err,data){
									if(err){console.log(err)}
							})
						})
					})
				}).catch((err) => {
					console.log(err);
				});
			}
			await SubCategory.updateOne(
				{ _id: mongoose.mongo.ObjectId(req.body.id) },
				subcategoryData, function(err,data){
					if(err){console.log(err)}
					req.flash('msg', {msg:'Sub Category has been Updated Successfully', status:false});	
					res.redirect(config.constant.ADMINCALLURL+'/manage_subcategory');
					req.flash({});	
			})
		}		
	},
	
    changeStatusSubCategory: function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return SubCategory.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatus(this,\'0\',\'change_status_subcategory\',\'list_subcategory\',\'subcategory\');";
				res.send('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatus(this,\'1\',\'change_status_subcategory\',\'list_subcategory\',\'subcategory\');";	
				res.send('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'">Inactive</span>');
			}
	    })
	},
	
    deleteSubCategory: async function(req,res){
		let id = req.param("id");
		return SubCategory.updateOne({_id:  mongoose.mongo.ObjectId(id)},{deletedAt:2},function(err,data){        	
			if(err) console.error(err);
        	res.send('done');
        })
	},

	checkSlug: function(req,res){
		var slug = req.body.slug;
		var id = req.body.id;
		var search = {deletedAt:0,slug:slug};
		if(id){
			search._id = {$ne:id}
		}
		SubCategory.find(search).exec(function(err,subcategoryData){
			if(subcategoryData.length > 0){
				res.send('OK');
			}else{
				res.send();
			}
		})
	}
}