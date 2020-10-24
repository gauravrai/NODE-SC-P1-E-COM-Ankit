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
const ADMINCALLURL = config.constant.ADMINCALLURL;
const Order = model.order;
const OrderDetail = model.order_detail;
const constant = require('../../../config/constant');

module.exports = {

    viewOrder: async function(req,res){
		let moduleName = 'Order Management';
		let pageTitle = 'View Order';
		await config.helpers.permission('view_order', req, (err,permissionData)=>{
			res.render('admin/order/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, permissionData:permissionData});
		});
    },
    listOrder:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.name = { $regex: '.*' + searchValue + '.*',$options:'i' };
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Order.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Order.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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

			await config.helpers.permission('view_order', req, async function(err,permissionData) {
                for(i=0;i<data.length;i++){
                    var arr1 = [];
                    arr1.push(data[i].orderId);
					await config.helpers.customer.getMobileById(data[i].customerId, async function (customerMobile) {
						const customer_mobile = customerMobile ? customerMobile.mobile : 'N/A';
						arr1.push(customer_mobile);
					})
                    arr1.push(data[i].orderStatus);
					arr1.push(data[i].orderFrom);
                    
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					$but_view = '<span><a href="'+ADMINCALLURL+'/order_detail?id='+data[i].orderId+'" class="btn btn-flat btn-info btn-outline-primary" title="View"><i class="fas fa-eye"></i></a></span>';
					arr1.push($but_view);
					arr.push(arr1);
				}
				obj.data = arr;
				res.send(obj);
			});
		});
    },
	orderDetail: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Order Management';
			let pageTitle = 'View Order Details';
            let orderId = req.body.id;

            const orderDetailData = await OrderDetail.aggregate([
				{
					$match: { orderId, deletedAt: 0, status: true}
				},
                {
                    $lookup:
                      {
                        from: "products",
                        localField: "productId",
                        foreignField: "_id",
                        as: "productData"
                      }
                },
                {
                    $unwind: "$productData"
                },
                {
                    $lookup:
                      {
                        from: "varients",
                        localField: "variantId",
                        foreignField: "_id",
                        as: "variantData"
                      }
                },
                {
                    $unwind: "$variantData"
                },
            ]);
            const [ orderData ] = await Order.aggregate([
				{
					$match: { orderId, deletedAt: 0, status: true}
				},
                {
                    $lookup:
                      {
                        from: "customers",
                        localField: "customerId",
                        foreignField: "_id",
                        as: "customerData"
                      }
                },
                {
                    $unwind: "$customerData"
                },
			]);
			
			res.render('admin/order/orderDetail',{layout:'admin/layout/layout', pageTitle, moduleName, orderData, orderDetailData, orderStatus: constant.ORDER_STATUS  } );
		}else{
		}
	}};
