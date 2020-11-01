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
const Customer = model.customer;
const Pincode = model.pincode;
const ADMINCALLURL = config.constant.ADMINCALLURL;
const Order = model.order;
const Orderdetail = model.order_detail;
const constant = require('../../../config/constant');

module.exports = {

    manageOrder: async function(req,res){
		let moduleName = 'Order Management';
		let pageTitle = 'View Order';
		await config.helpers.permission('manage_order', req, (err,permissionData)=>{
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

			await config.helpers.permission('manage_order', req, async function(err,permissionData) {
                for(i=0;i<data.length;i++){
                    var arr1 = [];
                    arr1.push(data[i].odid);
					await config.helpers.customer.getMobileById(data[i].userId, async function (customerMobile) {
						const customer_mobile = customerMobile ? customerMobile.mobile : 'N/A';
						arr1.push(customer_mobile);
					})
                    arr1.push(data[i].orderStatus);
					arr1.push(data[i].orderFrom);
                    
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					$but_view = '<span><a href="'+ADMINCALLURL+'/order_detail?id='+data[i].odid+'" class="btn btn-flat btn-info btn-outline-primary" title="View"><i class="fas fa-eye"></i></a></span>';
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
            let odid = req.body.id;

            const orderDetailData = await OrderDetail.aggregate([
				{
					$match: { odid, deletedAt: 0 }
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
					$match: { odid, deletedAt: 0, status: true}
				},
                {
                    $lookup:
                      {
                        from: "customers",
                        localField: "userId",
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
	},
    
    addOrder: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Order Management';
			let pageTitle = 'Add New Order';
			let productData = await Product.find({status:true, deletedAt: 0},{name: 1});
			let customerData = await Customer.find({status:true, deletedAt: 0},{mobile: 1});
			res.render('admin/order/add',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, productData:productData, customerData:customerData });
		}else
		{
			let userId = req.body.userId;
			let productId = Array.isArray(req.body.productId) ? req.body.productId : req.body.productId.split();
			let varientId = Array.isArray(req.body.varientId) ? req.body.varientId : req.body.varientId.split();
			let quantity = Array.isArray(req.body.quantity) ? req.body.quantity : req.body.quantity.split();
            let paymentType = 'COD';
			let orderFrom = 'WEB';
			let grandTotal = 0;
			let subTotal = 0;
			let grandQuantity = 0;
			let userData = await Customer.findOne({_id: mongoose.mongo.ObjectID(userId)});
			
			let customerDetail = {
				name : userData.name ? userData.name : '',
				mobile : userData.mobile ? userData.mobile : '',
				email : userData.email ? userData.email : '',
				address : userData.address ? userData.address : '',
				country : userData.country ? userData.country : '',
				stateId : userData.stateId ? mongoose.mongo.ObjectID(userData.stateId) : '',
				cityId : userData.cityId ? mongoose.mongo.ObjectID(userData.cityId) : '',
				pincodeId : userData.pincodeId ? mongoose.mongo.ObjectID(userData.pincodeId) : '',
				areaId : userData.areaId ? mongoose.mongo.ObjectID(userData.userId) : '',
				societyId : userData.societyId ? mongoose.mongo.ObjectID(userData.areaId) : '',
				towerId : userData.towerId ? mongoose.mongo.ObjectID(userData.towerId) : ''
			}

			let shippingPrice = await Pincode.findOne({_id: mongoose.mongo.ObjectID(userData.pincodeId)});
			shippingPrice = shippingPrice ? shippingPrice.shippingCharges : 0;
			grandTotal = grandTotal + shippingPrice;
			subTotal = subTotal + shippingPrice;

			let odid = 'OD'+moment().format('YMDhms');

            for (let i = 0; i < productId.length; i++) {
				let productData = await Product.findOne({_id: mongoose.mongo.ObjectID(productId[i])});
				let inventory = productData.inventory[0];
				function search(nameKey, myArray){
					for (var i=0; i < myArray.length; i++) {
						if (String(myArray[i].varientId) === nameKey) {
							return myArray[i];
						}
					}
				}
				let resultPrice = search(varientId[i], inventory);
				let price = resultPrice ? resultPrice.price : 0;
				let orderDetailInsertData = {
					userId: mongoose.mongo.ObjectID(userId),
					odid: odid,
					productId: mongoose.mongo.ObjectID(productId[i]),
					varientId: mongoose.mongo.ObjectID(varientId[i]), 
					price: parseInt(price),
					totalPrice: parseInt(price * quantity[i]),
					quantity: parseInt(quantity[i]),
					customerDetail : customerDetail,
				}
				grandTotal = grandTotal + orderDetailInsertData.totalPrice;
				subTotal = subTotal + orderDetailInsertData.totalPrice;
				grandQuantity = grandQuantity + orderDetailInsertData.quantity;
				let orderdetail = new Orderdetail(orderDetailInsertData);
				orderdetail.save();
				/*for (let j = 0; j < offerData.length; j++) {
					let productFound = offerData[j].offerProductId.includes(cartItemData[i].productId);
					if(productFound)
					{
						if(offerData[j].multipleOf == cartItemData[i].quantity)
						{
							let offerProductData = await Product.findOne({ _id: mongoose.mongo.ObjectID(cartItemData[i].productId) });
							let inventory = offerProductData.inventory[0];
							let freeProductData = await Product.findOne({ _id: mongoose.mongo.ObjectID(offerData[j].freeProductId) });
							
							let freeItemInsertData = {
								odid: odid,
								orderId: mongoose.mongo.ObjectID(order.id),
								orderDetailId: mongoose.mongo.ObjectID(orderdetail.id),
								userId: mongoose.mongo.ObjectID(cartItemData[i].userId),
								categoryId: mongoose.mongo.ObjectID(offerData[j].freeCategoryId), 
								subcategoryId: mongoose.mongo.ObjectID(offerData[j].freeSubcategoryId),
								productId: mongoose.mongo.ObjectID(offerData[j].freeProductId),
								varientId: mongoose.mongo.ObjectID(offerData[j].freeVarientId),
								price : freeProductData.price,
								quantity : offerData[j].freeItem
							}
							if(offerData[j].offerVarient == 'default')
							{
								function search(nameKey, myArray){
									for (var i=0; i < myArray.length; i++) {
										if (String(myArray[i].id) === nameKey) {
											return myArray[i];
										}
									}
								}
								var resultObject = search(cartItemData[i].varientId, inventory);
								if(typeof resultObject != 'undefined' && resultObject.default == true)
								{
									let freeitem = new Freeitem(freeItemInsertData);
									freeitem.save();
								}
							}
							else
							{
								let freeitem = new Freeitem(freeItemInsertData);
								freeitem.save();
							}
						}
					}
					
				}*/
			}
			
			let orderInsertData = {
				odid: odid,
				userId: mongoose.mongo.ObjectID(userId),
				customerDetail : customerDetail,
				grandTotal: grandTotal,
				subTotal: subTotal,
				shippingPrice: shippingPrice,
				quantity: grandQuantity,
				orderStatus: 'NEW',
				orderFrom: orderFrom,
				paymentStatus: 'PENDING',
				paymentType: paymentType
			}
			let order = new Order(orderInsertData);
			order.save(function(err, data){
				if(err){console.log(err)}
				req.flash('msg', {msg:'Order has been Created Successfully', status:false});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_order');
				req.flash({});
			});
		}
	},

	changeStatusOrderDetail: function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return OrderDetail.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){

			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatusOrderDetail($(this),\'0\',\'change_status_order_detail\',\'list_order\',\'orderDetail\');";
				res.send('<span class="badge bg-success" style="cursor:pointer;" id="'+id+'" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatusOrderDetail($(this),\'1\',\'change_status_order_detail\',\'list_order\',\'orderDetail\');";	
				res.send('<span class="badge bg-danger" style="cursor:pointer;" id="'+id+'" onclick="'+change_status+'">Inactive</span>');
			}
	    })
	},
};
