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
const ProductImage = model.product_image
const ADMINCALLURL = config.constant.ADMINCALLURL;


// var storage = multer.diskStorage({
// 	destination: "./public/uploads",
// 	filename: (req, thumbnailImage, cb)=> {
// 	  cb(null,thumbnailImage.filename+"_"+Date.now()+Path2D.extname(thumbnailImage.originalname));
// 	}
//   });
//   var upload = multer({ storage: storage }).single('thumbnailImage');


  // Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
		console.log("file------------------",file);
        cb(null, thumbnailImage.filename+"_"+ path.extname(file.originalname));
    }
});


// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
		console.log("file------------------",file.thumbnailImagef);
        checkFileType(file, cb);
    }
}).single('thumbnailImagef');
// }).array("multi-files", 10);

// .array("multi-files", 10);

// Check File Type
function checkFileType(file, cb) {
	consolel.log("mimetype && extname");
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
		
        return cb(null, true);
    } else {
		consolel.log("Error: Only [ jpeg|jpg|png|PNG|gif ] Images are accetable!");
        cb('Error: Only [ jpeg|jpg|png|PNG|gif ] Images are accetable!');
    }
}

module.exports = {

    manageProduct: async function(req,res){
		let moduleName = 'Product Management';
		let pageTitle = 'Manage Product';
		await config.helpers.permission('manage_product', req, (err,permissionData)=>{
			res.render('admin/product/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, permissionData:permissionData});
		});
	},
	
	listProduct:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.product = { $regex: '.*' + searchValue + '.*',$options:'i' };
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Product.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Product.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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
            //console.log(data);return false;
			await config.helpers.permission('manage_product', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
					var arr1 = [];
					await config.helpers.category.getNameById(data[i].cate_id, async function (categoryName) {
						arr1.push(categoryName.name);
					})
					await config.helpers.subcategory.getSubCatNameById(data[i].s_cate_id, async function (subcategoryName) {
						arr1.push(subcategoryName.sub_cat_name);
					})
					//arr1.push(data[i].s_cate_id);
                    arr1.push(data[i].name);
                    arr1.push(data[i].price);
					//arr1.push(data[i].store);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					if(!data[i].status){
						let change_status = "changeStatus(this,\'1\',\'change_status_product\',\'list_product\',\'product\');";	
						arr1.push('<span class="badge bg-danger" onclick="'+change_status+'" id="'+data[i]._id+'">Inactive</span>');
					}else{
						let change_status = "changeStatus(this,\'0\',\'change_status_product\',\'list_product\',\'product\');";
						arr1.push('<span class="badge bg-success" onclick="'+change_status+'" id="'+data[i]._id+'">Active</span>');
					}
					let $but_edit = '-';
					if(permissionData.edit=='1'){
					$but_edit = '<span><a href="'+ADMINCALLURL+'/edit_product?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
					}
					let $but_delete = ' - ';
					if(permissionData.delete =='1'){
						let remove = "deleteData(this,\'delete_product\',\'list_product\',\'product\');";
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
    
    addProduct: async function(req,res){
		try {
			if(req.method == "GET"){
				let moduleName = 'Product Management';
				let pageTitle = 'Add Product';
				let categoryData = await Category.find({status:true, deletedAt: 0});
				let storeData = await Store.find({status:true, deletedAt: 0});
				let stateData = await State.find({status:true, deletedAt: 0});
				res.render('admin/product/add.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName,storeData:storeData,stateData:stateData,categoryData:categoryData });
			}else{ 
				//console.log(req.body);
				//let catId = Array.isArray(req.body.categoryId);
				let categoryId  = Array.isArray(req.body.categoryId);
				if(categoryId=="true") {
					
					categoryId1  = categoryId.join();
				} else {
                    categoryId1  = req.body.categoryId;
				}
				let subcategoryId  = Array.isArray(req.body.subcategoryId);
				if(subcategoryId=="true") {
					
					subcategoryId1  = subcategoryId.join();
				} else {
                    subcategoryId1  = req.body.subcategoryId;
				}
				//console.log(subcategoryId1+"hell"); return false;
				let productData = {	
					cate_id : categoryId1,
					s_cate_id : subcategoryId1,
					name : req.body.product,
					price : req.body.price,
					offer : req.body.offer,
					discount: req.body.discount,
					discription : req.body.description,
					seo_keyword : req.body.seo
					 
				};
				let product = new Product(productData);
				let temp = product.save(async function(err, data){
					if(err){console.log(err)}
					let last_product_id = data.id;
					// insert images thumnail
					if(req.files.thumbnailImage){
						//console.log("test-------", req.files)
						let thumbnailImage = req.files.thumbnailImage;
						thumbnailImage.forEach(element => { 

							new Promise(async function(resolve, reject) { 
								var imagePath = './public/uploads/thumnail/';
								var imageName = Date.now()+'_'+element.name;
								element.mv(imagePath+imageName, function(err,data) {
									if (err) { 
										console.log(err)
										reject(err); 
									} else { 
										resolve(); 
									}
								})
							}).then(async (result) => { 
								// code after file upload
								// console.log(result);
								var imageNameSave = Date.now()+'_'+element.name;
								let productimageData = {
									image : imageNameSave,
									productId:last_product_id,
									imageType:"thumbnail"
								};
								let productimage = new ProductImage(productimageData);
								productimage.save(function(err, data){
									if(err){console.log(err)}
								})
							}).catch((err) => {
								console.log(err);
								// handle error
							});	
						});	

					}
					// insert small image  from here
					if(req.files.smallImage){
						//console.log("test-------", req.files)
						let smallImage = req.files.smallImage;
						smallImage.forEach(element => { 

							new Promise(async function(resolve, reject) { 
								var imagePath = './public/uploads/small/';
								var imageName = Date.now()+'_'+element.name;
								element.mv(imagePath+imageName, function(err,data) {
									if (err) { 
										console.log(err)
										reject(err); 
									} else { 
										resolve(); 
									}
								})
							}).then(async (result) => { 
								// code after file upload
								// console.log(result);
								var imageNameSave = Date.now()+'_'+element.name;
								let productimageData = {
									image : imageNameSave,
									productId:last_product_id,
									imageType:"small"
								};
								let productimage = new ProductImage(productimageData);
								productimage.save(function(err, data){
									if(err){console.log(err)}
								})
							}).catch((err) => {
								console.log(err);
								// handle error
							});	
						});	

					}
					// insert large image  from here
					if(req.files.largeImage){
						//console.log("test-------", req.files)
						let largeImage = req.files.largeImage;
						largeImage.forEach(element => { 

							new Promise(async function(resolve, reject) { 
								var imagePath = './public/uploads/large/';
								var imageName = Date.now()+'_'+element.name;
								element.mv(imagePath+imageName, function(err,data) {
									if (err) { 
										console.log(err)
										reject(err); 
									} else { 
										resolve(); 
									}
								})
							}).then(async (result) => { 
								// code after file upload
								// console.log(result);
								var imageNameSave = Date.now()+'_'+element.name;
								let productimageData = {
									image : imageNameSave,
									productId:last_product_id,
									imageType:"large"
								};
								let productimage = new ProductImage(productimageData);
								productimage.save(function(err, data){
									if(err){console.log(err)}
								})
							}).catch((err) => {
								console.log(err);
								// handle error
							});	
						});	

					}
					req.flash('msg', {msg:'Product has been Created Successfully', status:false});	
					res.redirect(config.constant.ADMINCALLURL+'/manage_product');
					req.flash({});	
				})
                   //console.log(req.body.categoryId.join(); 
				
				

				
				// new Promise(async function(resolve, reject) { 
				// 	var videoPath = './public/uploads/';
				// 	var videoName = Date.now()+'_'+req.files.thumbnailImagef.name;
				// 	req.files.thumbnailImagef.mv(videoPath+videoName, function(err,data) {
				// 		if (err) { 
				// 			console.log(err)
				// 			reject(err); 
				// 		} else { 
				// 			resolve(); 
				// 		}
				// 	})
				// }).then(async (result) => { 
				// 	// code after file upload
				// 	console.log(result);
				// 	var videoNameSave = Date.now()+'_'+req.files.thumbnailImagef.name;
				// 	let productData = {
				// 		image1 : videoNameSave
				// 	};
				// 	let product = new Product(productData);
				// 	product.save(function(err, data){
				// 		if(err){console.log(err)}
				// 		req.flash('msg', {msg:'Administrator has been Created Successfully', status:false});	
				// 		res.redirect(config.constant.ADMINCALLURL+'/manage_product');
				// 		req.flash({});	
				// 	})
				// }).catch((err) => {
				// 	console.log(err);
				// 	// handle error
				// });	
				
				
/*
				new Promise(function (resolve, reject) {
					var videoPath = config.constant.LIVEEVENTUPLOADPATH;
					var videoName = Date.now() + '_' + req.files.video.name;
					req.files.video.mv(videoPath + videoName, function (err, data) {
						eventDetail.video = videoName;
						if (err) {
							console.log(err)
							reject(err);
						} else {
							var thumbnailPath = config.constant.LIVEEVENTTHUMBNAILUPLOADPATH;
							var thumbnailArr = [req.files.thumbnail1, req.files.thumbnail2];
							var thumbnail = [];
							var i = 0;
							async.forEach(thumbnailArr, function (thumb, callback) {
								var thumbnailName = Date.now() + '_' + thumb.name;
								thumb.mv(thumbnailPath + thumbnailName, function (err, data) {
									if (err) {
										console.log(err)
										reject(err);
									} else {
										thumbnail[i++] = thumbnailName;
										callback();
									}
								})

							}, function (err) {
								eventDetail.thumbnail = thumbnail;
								resolve(eventDetail);
							});
						}
					})
				}).then(async (result) => {
					await Event.updateOne({ _id: new ObjectId(eventId) }, eventDetail, function (err, data) {
						if (err) { console.log(err) }
						var responseData = {
							id: eventId,
						}
						response = {
							"status": "success",
							"message": "Event files added successfully",
							"data": responseData
						};
						res.send(response);
					})
				}).catch((err) => {
					response = {
						"status": "error",
						"message": "Event files not added",
						"data": err
					};
					res.send(response);
				});
*/

			}
		} catch (error) {
			console.log(error);
		}		
	},

	editProduct: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Product Management';
			let pageTitle = 'Edit Product';
			let id = req.body.id;
			let categoryData = await Category.find({status:true, deletedAt: 0});
			let storeData = await Store.find({status:true, deletedAt: 0});
			let subcategoryData = await SubCategory.find({status:true, deletedAt: 0});
			let productData = await Product.findOne({_id: mongoose.mongo.ObjectId(id), status: true, deletedAt: 0});
			res.render('admin/product/edit',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, categoryData:categoryData, subcategoryData:subcategoryData,storeData:storeData,productData:productData} );
		}
		if(req.method == "POST"){
			// let storeData = {
			// 	s_name : req.body.store,
			// 	stateId : mongoose.mongo.ObjectId(req.body.stateId),
            //     cityId : mongoose.mongo.ObjectId(req.body.cityId),
            //     s_address:req.body.address
			// };
			// await Store.update(
			// 	{ _id: mongoose.mongo.ObjectId(req.body.id) },
			// 	storeData, function(err,data){
			// 		if(err){console.log(err)}
			// 		req.flash('msg', {msg:'Store has been Updated Successfully', status:false});	
			// 		res.redirect(config.constant.ADMINCALLURL+'/manage_store');
			// 		req.flash({});	
			// })
		}		
    },

	changeStatusProduct : function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return Product.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatus(this,\'0\',\'change_status_product\',\'list_product\',\'product\');";
				res.send('<span class="badge bg-success" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatus(this,\'1\',\'change_status_product\',\'list_product\',\'product\');";	
				res.send('<span class="badge bg-danger" onclick="'+change_status+'">Inactive</span>');
			}
	    })
	},
	deleteProduct : async function(req,res){
		let id = req.param("id");
		return Product.deleteOne({_id:  mongoose.mongo.ObjectId(id)},function(err,data){        	
			if(err) console.error(err);
        	res.send('done');
        })
	},
}