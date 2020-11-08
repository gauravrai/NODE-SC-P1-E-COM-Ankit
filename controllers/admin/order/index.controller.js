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
const Offer = model.offer;
const Freeitem = model.free_item;
const State = model.state;
const City = model.city;
const Area = model.area;
const Society = model.society;
const Tower = model.tower;
const Rejectorder = model.reject_order;
const constant = require('../../../config/constant');

module.exports = {

    manageOrder: async function(req,res){
		let moduleName = 'Order Management';
		let pageTitle = 'View Order';
		await config.helpers.permission('manage_order', req, async (err,permissionData)=>{
			await config.helpers.filter.orderFilter(req, async function (filterData) {
				console.log(filterData);
				if (filterData != "" && req.method == 'POST') {
					return res.redirect('manage_order' + filterData);
				}
				res.render('admin/order/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, permissionData:permissionData, orderStatus: constant.ORDER_STATUS, req:req});
			});
		});
	},
	
    listOrder:function(req,res){
		var search = {deletedAt:0};
		if (req.param('search_data')) {
			search.$or = [
				{ odid: { $regex: req.param('search_data') } },
				{ "customerDetail.name": { $regex: '.*' + req.param('search_data') + '.*', $options: 'i' } },
				{ "customerDetail.mobile": { $regex: req.param('search_data') } },
				{ "customerDetail.address": { $regex: req.param('search_data') } },
			];
		}
		if (req.param('order_status')) {
			search.orderStatus = new ObjectId(req.param("order_status"));
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
					await config.helpers.customer.getNameById(data[i].userId, async function (customerName) {
						const customer_name = customerName ? customerName.name : 'N/A';
						arr1.push(customer_name);
					})
					await config.helpers.customer.getMobileById(data[i].userId, async function (customerMobile) {
						const customer_mobile = customerMobile ? customerMobile.mobile : 'N/A';
						arr1.push(customer_mobile);
					})
                    arr1.push(data[i].customerDetail.address ? data[i].customerDetail.address: '');
                    arr1.push(data[i].grandTotal);
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
    
    addOrder: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Order Management';
			let pageTitle = 'Add New Order';
			let productData = await Product.find({status:true, deletedAt: 0},{name: 1});
			let customerData = await Customer.find({status:true, deletedAt: 0},{mobile: 1});
			res.render('admin/order/add',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, productData:productData, customerData:customerData });
		}else
		{
			// await config.helpers.sms.sendSMS('', async function (smsData) {
			// 	console.log('sms------',smsData);
			// })
			// return 0;
			let userId = req.body.userId;
			let productId = Array.isArray(req.body.productId) ? req.body.productId : req.body.productId.split();
			let varientId = Array.isArray(req.body.varientId) ? req.body.varientId : req.body.varientId.split();
			let quantity = Array.isArray(req.body.quantity) ? req.body.quantity : req.body.quantity.split();
            let paymentType = 'COD';
			let orderFrom = 'ADMIN';
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

                let offerData = await Offer.find({deletedAt:0, status:true, from: { '$lte': new Date() }, to: { '$gte':  new Date()} });
				for (let j = 0; j < offerData.length; j++) {
					let productFound = offerData[j].offerProductId.includes(productId[i]);
					if(productFound)
					{
						if(quantity[i] >= offerData[j].multipleOf)
						{
							let offerProductData = await Product.findOne({ _id: mongoose.mongo.ObjectID(productId[i]) });
							let inventory = offerProductData.inventory[0];
							let freeProductData = await Product.findOne({ _id: mongoose.mongo.ObjectID(offerData[j].freeProductId) });
							
							let freeItemInsertData = {
								odid: odid,
								orderDetailId: mongoose.mongo.ObjectID(orderdetail.id),
								userId: mongoose.mongo.ObjectID(userId),
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
										if (String(myArray[i].varientId) === nameKey) {
											return myArray[i];
										}
									}
								}
								var resultObject = search(varientId[i], inventory);
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
					
				}
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
	
	orderDetail: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Order Management';
			let pageTitle = 'View Order Details';
			let odid = req.body.id;

			let orderData = await Order.findOne({ odid:odid });
			
			await config.helpers.state.getNameById(orderData.customerDetail.stateId, async function (stateName) {
				orderData.customerDetail.state = stateName.name;
			})
			
			await config.helpers.city.getNameById(orderData.customerDetail.cityId, async function (cityName) {
				orderData.customerDetail.city = cityName.name;
			})
			
			await config.helpers.pincode.getNameById(orderData.customerDetail.pincodeId, async function (pincodeName) {
				orderData.customerDetail.pincode = pincodeName.name;
			})
			
			await config.helpers.area.getNameById(orderData.customerDetail.areaId, async function (areaName) {
				console.log(areaName);
				orderData.customerDetail.area = areaName.name;
			})
			
			await config.helpers.society.getNameById(orderData.customerDetail.societyId, async function (societyName) {
				orderData.customerDetail.society = societyName.name;
			})
			
			await config.helpers.tower.getNameById(orderData.customerDetail.towerId, async function (towerName) {
				orderData.customerDetail.tower = towerName.name;
			})

            let orderDetailData = await Orderdetail.aggregate([
				{
					$match: { odid:odid }
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
                    $lookup:
                      {
                        from: "varients",
                        localField: "varientId",
                        foreignField: "_id",
                        as: "varientData"
                      }
                },
            ]);
			
			let rejectOrderData = await Rejectorder.aggregate([
				{
					$match: { odid:odid }
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
                    $lookup:
                      {
                        from: "varients",
                        localField: "varientId",
                        foreignField: "_id",
                        as: "varientData"
                      }
                }
            ]);
			
            let freeItemData = await Freeitem.aggregate([
            	{
					$match: { odid:odid }
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
                    $lookup:
                      {
                        from: "varients",
                        localField: "varientId",
                        foreignField: "_id",
                        as: "varientData"
                      }
                }
            ]);
			res.render('admin/order/orderDetail',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, orderData:orderData, orderDetailData:orderDetailData, rejectOrderData:rejectOrderData, freeItemData:freeItemData, orderStatus: constant.ORDER_STATUS, moment:moment  } );
		}else{
		}
	},

	markAsNotAvailable: async function(req,res){
		if(req.method == "POST"){
			let id = req.body.id;
			let odid = req.body.odid;
			let grandTotal = 0;
			let subTotal = 0;
			let quantity = 0;
			for(i=0; i < id.length; i++){
				let orderDetailData = await Orderdetail.findOne({_id: mongoose.mongo.ObjectId(id[i]) },{createdAt: 0, updatedAt: 0, __v: 0, _id: 0, status: 0, deletedAt: 0} );
				grandTotal = ( grandTotal + orderDetailData.totalPrice );
				subTotal = ( subTotal + orderDetailData.totalPrice );
				quantity = ( quantity + orderDetailData.quantity );
				orderDetailData.orderDetailId = mongoose.mongo.ObjectId(orderDetailData.id);
				console.log(orderDetailData);
				let rejectOrder = new Rejectorder(orderDetailData);
				rejectOrder.save();

				// let freeItemData = await Freeitem.findOne({orderDetailId: mongoose.mongo.ObjectId(id[i]) });

				// await Orderdetail.deleteOne({_id: mongoose.mongo.ObjectId(id[i]) });
			}

			let orderData = await Order.findOne({odid: odid});

			let orderUpdateData = {
				grandTotal : orderData.grandTotal - grandTotal,
				subTotal : orderData.subTotal - subTotal,
				quantity : orderData.quantity - quantity
			}
			let updateOrder = await Order.updateOne({odid: odid},orderUpdateData);
			res.send('OK');
		}
	},

	changeOrderStatus: function(req,res){
		let orderId = req.param("orderId");
		let orderStatus = req.param("orderStatus");
		return Order.updateOne({_id: mongoose.mongo.ObjectId(orderId)}, {
			orderStatus: orderStatus
		},function(err,data){
			if(err) console.error(err);
			res.send('OK');
	    })
	},
};
