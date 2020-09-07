const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Category = model.category;
const Subcategory = model.sub_category;
const Product = model.product;
const Offer   = model.offer;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
    
    manageOffer: async function(req,res){
		let moduleName = 'Offer Management';
		let pageTitle = 'Manage Offer';
		await config.helpers.permission('manage_offer', req, (err,permissionData)=>{
			res.render('admin/offer/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, permissionData:permissionData});
		});
    },
    listOffer:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.offer = { $regex: '.*' + searchValue + '.*',$options:'i' };
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Offer.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Offer.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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
            //console.log(data);
			await config.helpers.permission('manage_offer', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
                    var arr1 = [];
                    arr1.push(data[i].name);
                    await config.helpers.product.getNameById(data[i].product_id, async function (productName) {
						var product_name = productName ? productName.name : 'A/N';
						//arr1.push(productName.name);
						arr1.push(product_name);
					})
                    await config.helpers.category.getNameById(data[i].cate_id, async function (categoryName) {
						var cat_name = categoryName ? categoryName.name : 'A/N';
						//arr1.push(categoryName.name);
						arr1.push(cat_name);
					})
					await config.helpers.subcategory.getSubCatNameById(data[i].s_cate_id, async function (subcategoryName) {
						var subcat_name = subcategoryName ? subcategoryName.sub_cat_name : 'A/N';
						//arr1.push(subcategoryName.sub_cat_name);
						arr1.push(subcat_name);
					})
					
					//arr1.push(data[i].store);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					if(!data[i].status){
						let change_status = "changeStatus(this,\'1\',\'change_status_offer\',\'list_offer\',\'offer\');";	
						arr1.push('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Inactive</span>');
					}else{
						let change_status = "changeStatus(this,\'0\',\'change_status_offer\',\'list_offer\',\'offer\');";
						arr1.push('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Active</span>');
					}
					let $but_edit = '-';
					if(permissionData.edit=='1'){
					$but_edit = '<span><a href="'+ADMINCALLURL+'/edit_offer?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
					}
					let $but_delete = ' - ';
					if(permissionData.delete =='1'){
						let remove = "deleteData(this,\'delete_offer\',\'list_offer\',\'offer\');";
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
    addOffer: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Offer Management';
			let pageTitle = 'Add Offer';
            let categoryData = await Category.find({status: true, deletedAt: 0});
            let subcategoryData = await Subcategory.find({status: true, deletedAt: 0});
            let productData     = await Product.find({status: true,offer:"Y",deletedAt: 0});
			res.render('admin/offer/add.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, categoryData:categoryData,subcategoryData:subcategoryData,productData:productData} );
		}else{
			let offerData = {
                name : req.body.offer_name,
				cate_id : mongoose.mongo.ObjectId(req.body.categoryId),
				s_cate_id : mongoose.mongo.ObjectId(req.body.subcategoryId),
                product_id : mongoose.mongo.ObjectId(req.body.productId),
                offer_type : req.body.offertype,
                percentage : req.body.percentage,
                fixed  : req.body.fixed,
                minimum_cart_value : req.body.min_cart_value,
                from : moment(req.body.from).format('YYYY-MM-DD'),
                to : moment(req.body.to).format('YYYY-MM-DD'),
                capping : req.body.capping,
                apply_for :req.body.applyfor
			};
			//console.log(storeData);
			let offer = new Offer(offerData);
			offer.save(function(err, data){
				if(err){console.log(err)}
				req.flash('msg', {msg:'Offer has been Created Successfully', status:false});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_offer');
				req.flash({});	
			})
		}		
    },
    editOffer: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Offer Management';
			let pageTitle = 'Edit Offer';
            let id = req.body.id;
            let offerData = await Offer.findOne({_id: mongoose.mongo.ObjectId(id), status: true, deletedAt: 0});
			let categoryData = await Category.find({status: true, deletedAt: 0});
            let subcategoryData = await Subcategory.find({status: true, deletedAt: 0});
            let productData     = await Product.find({status: true,offer:"Y",deletedAt: 0});
			res.render('admin/offer/edit.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, categoryData:categoryData,subcategoryData:subcategoryData,productData:productData,offerData:offerData,moment:moment} );
		}
		if(req.method == "POST"){
			let offerData = {
                name : req.body.offer_name,
				cate_id : mongoose.mongo.ObjectId(req.body.categoryId),
				s_cate_id : mongoose.mongo.ObjectId(req.body.subcategoryId),
                product_id : mongoose.mongo.ObjectId(req.body.productId),
                offer_type : req.body.offertype,
                percentage : req.body.percentage,
                fixed  : req.body.fixed,
                minimum_cart_value : req.body.min_cart_value,
                from : moment(req.body.from).format('YYYY-MM-DD'),
                to : moment(req.body.to).format('YYYY-MM-DD'),
                capping : req.body.capping,
                apply_for :req.body.applyfor
			};
			await Offer.update(
				{ _id: mongoose.mongo.ObjectId(req.body.id) },
				offerData, function(err,data){
					if(err){console.log(err)}
					req.flash('msg', {msg:'Offer has been Updated Successfully', status:false});	
					res.redirect(config.constant.ADMINCALLURL+'/manage_offer');
					req.flash({});	
			})
		}		
    },
    changeStatusOffer : function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return Offer.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatus(this,\'0\',\'change_status_offer\',\'list_offer\',\'offer\');";
				res.send('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatus(this,\'1\',\'change_status_offer\',\'list_offer\',\'offer\');";	
				res.send('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'">Inactive</span>');
			}
	    })
    },
    deleteOffer : async function(req,res){
		let id = req.param("id");
		return Offer.deleteOne({_id:  mongoose.mongo.ObjectId(id)},function(err,data){        	
			if(err) console.error(err);
        	res.send('done');
        })
	},
}