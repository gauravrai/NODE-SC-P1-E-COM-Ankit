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
const Product = model.product;
const Stock = model.stock;
const Brand   = model.brand;
const StockEntries = model.stock_entries;
const Varient   = model.varient;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {

    manageStock: async function(req,res){
		let moduleName = 'Stock Management';
		let pageTitle = 'Manage Stock';
		let storeData = await Store.find({status:true, deletedAt: 0});
		await config.helpers.permission('manage_stock', req, async (err,permissionData)=>{
			await config.helpers.filter.stockFilter(req, async function (filterData) {
				if (filterData != "" && req.method == 'POST') {
					return res.redirect('manage_stock' + filterData);
				}
				res.render('admin/stock/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, permissionData:permissionData, req: req, filterData:filterData, storeData:storeData });
			});
		});
	},
	
	listStock:function(req,res){
		var search = {deletedAt:0}
		if (req.param('store_id')) {
			search.storeId = mongoose.mongo.ObjectId(req.param("store_id"));
		}
		if (req.param('date_from') && req.param('date_to')) {
			var today = new Date(req.param('date_to'));
			var tomorrow = new Date(req.param('date_to'));
			tomorrow.setDate(today.getDate() + 1);
			var tomorrow = tomorrow.toLocaleDateString();
			search.createdAt = { '$gte': new Date(req.param('date_from')), '$lte': new Date(tomorrow) }
		}
		console.log(search);
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Stock.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Stock.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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

			await config.helpers.permission('manage_stock', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
					var arr1 = [];
					await config.helpers.product.getNameById(data[i].productId, async function (productName) {
						var product_name = productName ? productName.name : 'N/A';
						arr1.push(product_name);
					})
					await config.helpers.varient.getNameById(data[i].varientId, async function (varientName) {
						var varient_name = varientName ? varientName.label+' '+varientName.measurementUnit : 'N/A';
						arr1.push(varient_name);
					})
					arr1.push(data[i].count);
					await config.helpers.store.getNameById(data[i].storeId, async function (storeName) {
						var store_name = storeName ? storeName.name : 'N/A';
						arr1.push(store_name);
					});
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					if(!data[i].status){
						let change_status = "changeStatus(this,\'1\',\'change_status_stock\',\'list_stock\',\'stock\');";	
						arr1.push('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Inactive</span>');
					}else{
						let change_status = "changeStatus(this,\'0\',\'change_status_stock\',\'list_stock\',\'stock\');";
						arr1.push('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Active</span>');
					}
					let $but_edit = '-';
					if(permissionData.edit=='1'){
					// $but_edit = '<span><a href="'+ADMINCALLURL+'/edit_stock?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
					}
					let $but_delete = ' - ';
					if(permissionData.delete =='1'){
						let remove = "deleteData(this,\'delete_stock\',\'list_stock\',\'stock\');";
						$but_delete = '&nbsp;&nbsp;<span><a href="javascript:void(0)" class="btn btn-flat btn-info btn-outline-danger" title="Delete" onclick="'+remove+'" id="'+data[i]._id+'"><i class="fas fa fa-trash" ></i></a></span>';
					}
					arr1.push($but_delete);
					arr.push(arr1);
				}
				obj.data = arr;
				res.send(obj);
			});
		});
	},
    
    addStock: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Stock Management';
			let pageTitle = 'Add Stock';
			let productData = await Product.find({status:true, deletedAt: 0});
			let storeData = await Store.find({status:true, deletedAt: 0});
			res.render('admin/stock/add.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, storeData:storeData, productData:productData });
		}else
		{
			const { productId, varientId, count, costPrice, storeId, transactionType } = req.body;
			console.log(req.body);
			const stockData = await Stock.findOne({
				status: true, deletedAt: 0, productId: mongoose.mongo.ObjectId(productId), varientId: mongoose.mongo.ObjectId(varientId), storeId: mongoose.mongo.ObjectId(storeId),
			});
			if ((!stockData && transactionType === 'out') || (stockData && transactionType === 'out' && (parseInt(stockData.count) - parseInt(count)) < 0)) {
				req.flash('msg', {msg:'Not enough stock available', status:false});
				res.redirect(config.constant.ADMINCALLURL+'/add_stock');
			} else {
				if (stockData) {
					const countToUpdate = transactionType === 'in' 
						? (parseInt(stockData.count) + parseInt(count))
						: (parseInt(stockData.count) - parseInt(count))
					await Stock.updateOne(
						{ productId: mongoose.mongo.ObjectId(productId), storeId: mongoose.mongo.ObjectId(storeId), varientId: mongoose.mongo.ObjectId(varientId), costPrice, status: true, deletedAt: 0, },
						{ count: countToUpdate },
						function(err,data){
							if(err){console.log(err)}
						})
				} else {
					const stock = new Stock({ productId: mongoose.mongo.ObjectId(productId), count, varientId: mongoose.mongo.ObjectId(varientId), costPrice, storeId: mongoose.mongo.ObjectId(storeId), });
					stock.save(function(err, data){
					if(err){console.log(err)}	
					});
				}
	
				const stockEntries = new StockEntries({
					productId: mongoose.mongo.ObjectId(productId), count, varientId: mongoose.mongo.ObjectId(varientId), storeId:mongoose.mongo.ObjectId(storeId), transactionType,
				});
				stockEntries.save(function(err, data){
					if(err){console.log(err)}	
				});
				req.flash('msg', {msg:'Stock Added Successfully', status:false});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_stock');
				req.flash({});
			}
		}
	},

	changeStatusStock: function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return Stock.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatus(this,\'0\',\'change_status_stock\',\'list_stock\',\'product\');";
				res.send('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatus(this,\'1\',\'change_status_stock\',\'list_stock\',\'product\');";	
				res.send('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'">Inactive</span>');
			}
	    })
	},
	deleteStock: async function(req,res){
		let id = req.param("id");
		return Stock.updateOne({_id:  mongoose.mongo.ObjectId(id)},{deletedAt:2},function(err,data){        	
			if(err) console.error(err);
        	res.send('done');
        })
	},
	checkStockkeeping : async function(req,res){
		   let stockkeeping  = req.body.stock_keeping;
		   let productData = await Stock.find({stock_keeping:stockkeeping, status:true, deletedAt: 0});
		   if(productData.length>0){
			   return res.status(200).json({ code:1 , status: 'exists', message: "Stock Keeping Unit Already Inserted !!"});
		   } else {
			return res.status(200).json({ code:0 , status: '', message: "" });
		   }
	},
	transferStock: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Stock Management';
			let pageTitle = 'Transfer Stock';
			let productData = await Product.find({status:true, deletedAt: 0});
			let storeData = await Store.find({status:true, deletedAt: 0});
			res.render('admin/stock/transfer.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, storeData:storeData, productData:productData });
		}
		if (req.method === 'POST') {
			const { productId, varientId, count, toStoreId, fromStoreId } = req.body;
			const fromStoreData = await Stock.findOne({
				status: true, deletedAt: 0, productId: mongoose.mongo.ObjectId(productId), varientId: mongoose.mongo.ObjectId(varientId), storeId: mongoose.mongo.ObjectId(fromStoreId),
			});
			if (!fromStoreData || (fromStoreData && (parseInt(fromStoreData.count) - parseInt(count)) < 0) ) {
				req.flash('msg', {msg:'Not enough stock available', status:false});
				res.redirect(config.constant.ADMINCALLURL+'/transfer_stock');
			} else {
				const toStoreData = await Stock.findOne({
					status: true, deletedAt: 0, productId: mongoose.mongo.ObjectId(productId), varientId: mongoose.mongo.ObjectId(varientId), storeId: mongoose.mongo.ObjectId(toStoreId),
				});
				const updatedStockFromStore = Stock.updateOne(
					{ productId: mongoose.mongo.ObjectId(productId), storeId: mongoose.mongo.ObjectId(fromStoreId), varientId: mongoose.mongo.ObjectId(varientId), status: true, deletedAt: 0, },
					{ count: parseInt(fromStoreData.count) - parseInt(count) });
				const updatedStockToStore = Stock.updateOne(
					{ productId: mongoose.mongo.ObjectId(productId), storeId: mongoose.mongo.ObjectId(toStoreId), varientId: mongoose.mongo.ObjectId(varientId), status: true, deletedAt: 0, },
					{ count: toStoreData ? (parseInt(toStoreData.count) + parseInt(count)) : parseInt(count) },
					{ upsert: true },
				);
				const stockEntriesData = StockEntries.findOne({ productId: mongoose.mongo.ObjectId(productId), storeId: mongoose.mongo.ObjectId(fromStoreId), varientId: mongoose.mongo.ObjectId(varientId), status: true, deletedAt: 0, },)

				const [stockEntryData] = await Promise.all([stockEntriesData, updatedStockFromStore, updatedStockToStore]);
				await StockEntries.insertMany([
					{
						productId: mongoose.mongo.ObjectId(productId), count: (parseInt(fromStoreData.count) - parseInt(count)), varientId: mongoose.mongo.ObjectId(varientId), costPrice: fromStoreData.costPrice, storeId:mongoose.mongo.ObjectId(fromStoreId), transactionType: 'out',
					},
					{
						productId: mongoose.mongo.ObjectId(productId), count: (toStoreData ? (parseInt(toStoreData.count) + parseInt(count)) : parseInt(count) ), varientId: mongoose.mongo.ObjectId(varientId), costPrice: fromStoreData.costPrice, storeId:mongoose.mongo.ObjectId(toStoreId), transactionType: 'in',
					},
				]);
				req.flash('msg', {msg:'Stock transferred successfully', status:false});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_stock');
				req.flash({});
			}

		}
	},
}