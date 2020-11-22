const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const moment = require('moment');
const Requestproduct = model.request_product;
const Category = model.category;
const SubCategory = model.sub_category;
const Store = model.store;
const State = model.state;
const Product = model.product;
const Brand   = model.brand;
const Varient   = model.varient;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {

    productRequest: async function(req,res){
		let moduleName = 'Requested Product Management';
		let pageTitle = 'Manage Requested Product';
		await config.helpers.permission('manage_product', req, (err,permissionData)=>{
			res.render('admin/productrequest/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, permissionData:permissionData});
		});
	},
	
	listProductRequest:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.name = { $regex: '.*' + searchValue + '.*',$options:'i' };
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Requestproduct.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Requestproduct.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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
			await config.helpers.permission('manage_product', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
					var arr1 = [];
					await config.helpers.product.getNameById(data[i].productId, async function (productName) {
						var product_name = productName ? productName.name : 'N/A';
						arr1.push(product_name);
					})
                    arr1.push(data[i].description);
					await config.helpers.customer.getNameById(data[i].userId, async function (userName) {
						var user_name = userName ? userName.name : 'N/A';
						arr1.push(user_name);
					})
                    arr1.push(data[i].email);
                    arr1.push(data[i].mobile);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
                    arr1.push(data[i].address);
                    arr1.push(data[i].pincode);
					arr.push(arr1);
				}
				obj.data = arr;
				res.send(obj);
			});
		});
	},
}