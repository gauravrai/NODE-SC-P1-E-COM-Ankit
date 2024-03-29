const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const async = require("async");
const mongoose = require('mongoose');
const moment = require('moment');
const pdf = require('html-pdf');
const numWords = require('num-words');
const Store = model.store;
const Product = model.product;
const Customer = model.customer;
const Pincode = model.pincode;
const ADMINCALLURL = config.constant.ADMINCALLURL;
const Order = model.order;
const Orderdetail = model.order_detail;
const Offer = model.offer;
const Freeitem = model.free_item;
const Rejectorder = model.reject_order;
const Messagetemplate = model.message_template;
const Stock = model.stock;
const Emailtemplate = model.email_template;
const constant = require('../../../config/constant');

module.exports = {

    manageOrder: async function(req,res){
		let moduleName = 'Order Management';
		let pageTitle = 'View Order';
		var detail = {};	
		detail = {message:req.flash('msg')};
		await config.helpers.permission('manage_order', req, async (err,permissionData)=>{
			await config.helpers.filter.orderFilter(req, async function (filterData) {
				if (filterData != "" && req.method == 'POST') {
					return res.redirect('manage_order' + filterData);
				}
				res.render('admin/order/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, detail:detail, permissionData:permissionData, orderStatus: constant.ORDER_STATUS, req: req, filterData:filterData });
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
			search.orderStatus = req.param("order_status");
		}
		if (req.param('date_from') && req.param('date_to')) {
			var today = new Date(req.param('date_to'));
			var tomorrow = new Date(req.param('date_to'));
			tomorrow.setDate(today.getDate() + 1);
			var tomorrow = tomorrow.toLocaleDateString();
			search.createdAt = { '$gte': new Date(req.param('date_from')), '$lte': new Date(tomorrow) }
		}
		if (req.param('order_from')) {
			search.orderFrom = req.param("order_from");
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
					await config.helpers.customer.getNameById(data[i].userId, async function (customerName) {
						const customer_name = customerName ? customerName.name : 'N/A';
						arr1.push(customer_name);
					})
					await config.helpers.customer.getMobileById(data[i].userId, async function (customerMobile) {
						const customer_mobile = customerMobile ? customerMobile.mobile : 'N/A';
						arr1.push(customer_mobile);
					})
                    arr1.push(data[i].customerDetail.shippingAddress.address ? data[i].customerDetail.shippingAddress.address: '');
                    arr1.push((data[i].grandTotal + data[i].totalTax + data[i].shippingPrice ).toFixed(2)+' INR');
                    arr1.push(data[i].orderStatus);
                    arr1.push(data[i].paymentStatus);
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
			let customerData = await Customer.find({status:true, deletedAt: 0},{mobile: 1, name:1});
			res.render('admin/order/add',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, productData:productData, customerData:customerData });
		}else
		{
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
            let customerGST = userData.gst;
            let clientGST = config.constant.CLIENT_GST_NO;
            let clientGSTStateCode = config.constant.CLIENT_GST_STATE_CODE;
            let taxType;
            let totalTax = 0;
			
			let customerDetail = {
				name : userData.name ? userData.name : '',
				mobile : userData.mobile ? userData.mobile : '',
				email : userData.email ? userData.email : '',
				gst : userData.gst ? userData.gst : '',
				sameAsBillingAddress: userData.sameAsBillingAddress ? userData.sameAsBillingAddress : false,
				billingAddress: userData.billingAddress ? userData.billingAddress : {},
				shippingAddress: userData.shippingAddress ? userData.shippingAddress : {}
			}
			let shippingPrice = 0;
			if(userData.shippingAddress.pincode){
				shippingPrice = await Pincode.findOne({_id: mongoose.mongo.ObjectID(userData.shippingAddress.pincode)});
				shippingPrice = shippingPrice ? shippingPrice.shippingCharges : 0;
			}
			grandTotal = grandTotal + shippingPrice;
			subTotal = subTotal + shippingPrice;

			let odid = 'OD'+moment().format('YMDhms');

            for (let i = 0; i < productId.length; i++) {
				let tax, cgst, sgst, igst = 0;
				let productData = await Product.findOne({_id: mongoose.mongo.ObjectID(productId[i])});
				let inventory = productData.inventory[0];
				let productTax = productData.tax;
				function search(nameKey, myArray){
					for (var i=0; i < myArray.length; i++) {
						if (String(myArray[i].varientId) === nameKey) {
							return myArray[i];
						}
					}
				}
				let resultPrice = search(varientId[i], inventory);
				let price = resultPrice ? resultPrice.price : 0;
				tax = productTax;
				if(customerGST){
					let customerGSTStateCode =  customerGST.substring(0, 2);
					if(customerGSTStateCode == clientGSTStateCode){
						cgst = ( price * parseInt(quantity[i]) * tax )/100;
						sgst = cgst;
						totalTax += (cgst + sgst);
						taxType = 1;
					}else {
						igst = ( price * parseInt(quantity[i]) * tax )/100;
						totalTax += igst;
						taxType = 2;
					}
				}
				else
				{
					productTax = productTax/2;
					cgst = ( price * parseInt(quantity[i]) * tax )/100;
					sgst = cgst;
					totalTax += (cgst + sgst);
					taxType = 1;
				}
				let orderDetailInsertData = {
					userId: mongoose.mongo.ObjectID(userId),
					odid: odid,
					productId: mongoose.mongo.ObjectID(productId[i]),
					varientId: mongoose.mongo.ObjectID(varientId[i]), 
					price: parseInt(price),
					totalPrice: parseInt(price * quantity[i]),
					quantity: parseInt(quantity[i]),
					customerDetail : customerDetail,
					taxType : taxType,
					tax : tax,
					cgst : cgst,
					sgst : sgst,
					igst : igst
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
				paymentType: paymentType,
				taxType : taxType,
				totalTax: totalTax
			}
			let order = new Order(orderInsertData);
			order.save(async function(err, data){
				if(err){console.log(err)}
				let messageData = await Messagetemplate.findOne({slug: 'NEW-ORDER'});
				let slug = messageData.slug;
				let message = messageData.message;
				message = message.replace('[CUSTOMER]', userData.name);
				message = message.replace('[ODID]', odid);
				await config.helpers.sms.sendSMS(userData, slug, message, async function (smsData) {
					let emailData = await Emailtemplate.findOne({slug: 'NEW-ORDER'});
					let subject = emailData.subject;
					let message1 = emailData.message;
					message1 = message1.replace('[CUSTOMER]', userData.name);
					message1 = message1.replace('[ODID]', odid);
					await config.helpers.email.sendEmail(userData.email, subject, message1, async function (emailData) {
						req.flash('msg', {msg:'Order has been Created Successfully', status:true});	
						res.redirect(config.constant.ADMINCALLURL+'/manage_order');
						req.flash({});
					});
				});
			});
		}
	},
	
	orderDetail: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Order Management';
			let pageTitle = 'View Order Details';
			let odid = req.body.id;

			let orderData = await Order.findOne({ odid:odid });
			
			await config.helpers.state.getNameById(orderData.customerDetail.billingAddress.state, async function (stateName) {
				orderData.customerDetail.billingAddress.state = stateName.name;
			})
			
			await config.helpers.city.getNameById(orderData.customerDetail.billingAddress.city, async function (cityName) {
				orderData.customerDetail.billingAddress.city = cityName.name;
			})
			
			await config.helpers.pincode.getNameById(orderData.customerDetail.billingAddress.pincode, async function (pincodeName) {
				orderData.customerDetail.billingAddress.pincode = pincodeName.name;
			})
			
			await config.helpers.area.getNameById(orderData.customerDetail.billingAddress.area, async function (areaName) {
				orderData.customerDetail.billingAddress.area = areaName.name;
			})
			
			await config.helpers.society.getNameById(orderData.customerDetail.billingAddress.society, async function (societyName) {
				orderData.customerDetail.billingAddress.society = societyName.name;
			})
			
			await config.helpers.tower.getNameById(orderData.customerDetail.billingAddress.tower, async function (towerName) {
				orderData.customerDetail.billingAddress.tower = towerName.name;
			})
			
			await config.helpers.state.getNameById(orderData.customerDetail.shippingAddress.state, async function (stateName) {
				orderData.customerDetail.shippingAddress.state = stateName.name;
			})
			
			await config.helpers.city.getNameById(orderData.customerDetail.shippingAddress.city, async function (cityName) {
				orderData.customerDetail.shippingAddress.city = cityName.name;
			})
			
			await config.helpers.pincode.getNameById(orderData.customerDetail.shippingAddress.pincode, async function (pincodeName) {
				orderData.customerDetail.shippingAddress.pincode = pincodeName.name;
			})
			
			await config.helpers.area.getNameById(orderData.customerDetail.shippingAddress.area, async function (areaName) {
				orderData.customerDetail.shippingAddress.area = areaName.name;
			})
			
			await config.helpers.society.getNameById(orderData.customerDetail.shippingAddress.society, async function (societyName) {
				orderData.customerDetail.shippingAddress.society = societyName.name;
			})
			
			await config.helpers.tower.getNameById(orderData.customerDetail.shippingAddress.tower, async function (towerName) {
				orderData.customerDetail.shippingAddress.tower = towerName.name;
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
			let storeData = await Store.find({deletedAt: 0, status: true});
			res.render('admin/order/orderDetail',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, orderData:orderData, orderDetailData:orderDetailData, rejectOrderData:rejectOrderData, freeItemData:freeItemData, orderStatus: constant.ORDER_STATUS, paymentStatus: constant.PAYMENT_STATUS, timeSlot: constant.TIME_SLOT, moment:moment, storeData:storeData  } );
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
			let taxAmount = 0;
			for(i=0; i < id.length; i++){
				let rejectOrderInsertData = {};
				let orderDetailData = await Orderdetail.findOne({_id: mongoose.mongo.ObjectId(id[i]) },{createdAt: 0, updatedAt: 0, __v: 0, _id: 0, status: 0, deletedAt: 0} );
				rejectOrderInsertData.orderDetailId = mongoose.mongo.ObjectId(orderDetailData.id);
				rejectOrderInsertData.userId = orderDetailData.userId;
				rejectOrderInsertData.odid = orderDetailData.odid;
				rejectOrderInsertData.productId = orderDetailData.productId;
				rejectOrderInsertData.varientId = orderDetailData.varientId;
				rejectOrderInsertData.price = orderDetailData.price;
				rejectOrderInsertData.totalPrice = orderDetailData.totalPrice;
				rejectOrderInsertData.quantity = orderDetailData.quantity;
				rejectOrderInsertData.taxType = orderDetailData.taxType;
				rejectOrderInsertData.tax = orderDetailData.tax;
				rejectOrderInsertData.cgst = orderDetailData.cgst;
				rejectOrderInsertData.sgst = orderDetailData.sgst;
				rejectOrderInsertData.igst = orderDetailData.igst;
				let rejectOrder = new Rejectorder(rejectOrderInsertData);
				rejectOrder.save();
				grandTotal = ( grandTotal + orderDetailData.totalPrice );
				subTotal = ( subTotal + orderDetailData.totalPrice );
				quantity = ( quantity + orderDetailData.quantity );
				if(orderDetailData.taxType == 1)
				{
					taxAmount = ( taxAmount + orderDetailData.cgst + orderDetailData.sgst );
				}else {
					taxAmount = ( taxAmount + orderDetailData.igst );
				}

				let freeItemData = await Freeitem.findOne({orderDetailId: mongoose.mongo.ObjectId(id[i]) });
				await Orderdetail.deleteOne({_id: mongoose.mongo.ObjectId(id[i]) });
			}

			let orderData = await Order.findOne({odid: odid});

			let orderUpdateData = {
				grandTotal : orderData.grandTotal - grandTotal,
				subTotal : orderData.subTotal - subTotal,
				quantity : orderData.quantity - quantity,
				totalTax : orderData.totalTax - taxAmount
			}
			let updateOrder = await Order.updateOne({odid: odid},orderUpdateData);
			res.send('OK');
		}
	},

	changeOrderStatus: async function(req,res){
		let userId = req.param("userId");
		let orderId = req.param("orderId");
		let odid = req.param("odid");
		let orderStatus = req.param("orderStatus");
		let paymentStatus = req.param("paymentStatus");
		let storeId = req.param("storeId");
		let timeSlot = req.param("timeSlot");
		let receiverName = req.param('receiverName');
		let deliveryDate = req.param('deliveryDate');
		let messageSlug;
		if(orderStatus == 'IN_PROCESS'){
			messageSlug = 'IN-PROCESS-ORDER';
		}else if(orderStatus == 'IN_TRANSIT'){
			messageSlug = 'IN-TRANSIT-ORDER';
		}else if(orderStatus == 'DELIVERED'){
			messageSlug = 'DELIVERED-ORDER';
		}else if(orderStatus == 'CANCELED'){
			messageSlug = 'CANCELED-ORDER';
		}
		let userData = await Customer.findOne({_id: mongoose.mongo.ObjectID(userId)});
		let messageData = await Messagetemplate.findOne({slug: messageSlug});
		let slug = messageData.slug;
		let message = messageData.message;
		message = message.replace('[CUSTOMER]', userData.name);
		message = message.replace('[ODID]', odid);

		let emailData = await Emailtemplate.findOne({slug: 'NEW-ORDER'});
		let subject = emailData.subject;
		let message1 = emailData.message;
		message1 = message1.replace('[CUSTOMER]', userData.name);
		message1 = message1.replace('[ODID]', odid);

		if(orderStatus == 'IN_TRANSIT'){
			message = message.replace('[TIMESLOT]', timeSlot ? timeSlot : config.constant.DEFAULTTIMESLOT);
			message1 = message1.replace('[TIMESLOT]', timeSlot ? timeSlot : config.constant.DEFAULTTIMESLOT);
		}
		if(orderStatus == 'DELIVERED'){
			message = message.replace('[RECEIVERNAME]', receiverName);
			message1 = message1.replace('[RECEIVERNAME]', receiverName);
		}

		if(orderStatus == 'IN_TRANSIT')
		{
			let productIdArr = req.body.productIdArr;
			let varientIdArr = req.body.varientIdArr;
			let quantityArr = req.body.quantityArr;
			for (let i = 0; i < productIdArr.length; i++) {
				let availableProduct = await Stock.findOne({ productId: mongoose.mongo.ObjectId(productIdArr[i]), varientId: mongoose.mongo.ObjectId(varientIdArr[i]), status: true, deletedAt: 0 });
				let quantity = 0;
				if(availableProduct)
				{
					if(availableProduct.count >= quantityArr[i])
					{
						quantity = availableProduct.count - quantityArr[i];
					}
					else
					{
						quantity = availableProduct.count - availableProduct.count;
					}
					Stock.updateOne({_id: mongoose.mongo.ObjectId(availableProduct.id)}, {
						count: quantity
					},function(err,data){
						if(err) console.error(err);
					});
				}
			}
			return Order.updateOne({_id: mongoose.mongo.ObjectId(orderId)}, {
				orderStatus: orderStatus,
				storeId: mongoose.mongo.ObjectId(storeId),
				timeSlot: timeSlot,
				deliveryDate: deliveryDate
			},async function(err,data){
				if(err) console.error(err);
				await config.helpers.sms.sendSMS(userData, slug, message, async function (smsData) {
					await config.helpers.email.sendEmail(userData.email, subject, message1, async function (emailData) {
						res.send('OK');
					});
				});
			});
		}
		else if(orderStatus == 'DELIVERED')
		{	
			
			return Order.updateOne({_id: mongoose.mongo.ObjectId(orderId)}, {
				orderStatus: orderStatus,
				paymentStatus: paymentStatus,
				storeId: mongoose.mongo.ObjectId(storeId),
				receiverName: receiverName
			},async function(err,data){
				if(err) console.error(err);
				await config.helpers.sms.sendSMS(userData, slug, message, async function (smsData) {
					await config.helpers.email.sendEmail(userData.email, subject, message1, async function (emailData) {
						res.send('OK');
					});
				})
			})
		}
		else
		{
			return Order.updateOne({_id: mongoose.mongo.ObjectId(orderId)}, {
				orderStatus: orderStatus,
				paymentStatus: paymentStatus,
				storeId: mongoose.mongo.ObjectId(storeId),
			},async function(err,data){
				if(err) console.error(err);
				await config.helpers.sms.sendSMS(userData, slug, message, async function (smsData) {
					await config.helpers.email.sendEmail(userData.email, subject, message1, async function (emailData) {
						res.send('OK');
					});
				});
			})
		}
	},
	
	checkAvailableProduct: async function(req,res){
		let productIdArr = req.body.productIdArr;
		let varientIdArr = req.body.varientIdArr;
		let available = 0;
		for (let i = 0; i < productIdArr.length; i++) {
			let availableProduct = await Stock.find({ productId: mongoose.mongo.ObjectId(productIdArr[i]), varientId: mongoose.mongo.ObjectId(varientIdArr[i]), status: true, deletedAt: 0 });
			if(availableProduct.length == 0)
			{
				available = 1;
				res.send('Some Products are not available in selected store.');
			}
		}
		if(available == 0)
		{
			res.send('OK');
		}
	},
	
	makeInvoice: async function(req,res){
		if(req.method == 'GET')
		{
			let odid = req.query.id;
			await config.helpers.order.getInvoiceData(odid, async function (data) {
				let orderData = data.orderData;
				let orderDetailData = data.orderDetailData;
				res.render('admin/pdf/invoice', {layout:false, orderData:orderData, orderDetailData:orderDetailData, odid:odid, numWords:numWords} );
			});
		}
		if(req.method == 'POST')
		{
			let htmlData = req.body.htmlData;
			let odid = req.body.odid;
			let options = { format: 'Letter', orientation: 'landscape', type: "pdf" };
			pdf.create(htmlData, options).toFile(config.constant.INVOICEPATH + odid +'.pdf', function (err, result) {
				let pdf = config.constant.INVOICEPATH + odid +'.pdf';
				res.send(pdf);
			});
		}
	},
	
	downloadInvoice: function (req, res) {
		let odid = req.query.id;
		let pdf = config.constant.ABSOLUTEPATH + "/public/uploads/invoice/" + odid +".pdf";
		res.download(pdf);
	},

};
