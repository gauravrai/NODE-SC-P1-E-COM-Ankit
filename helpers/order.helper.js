const model  = require('../models/index.model');
const config = require('../config/index');
const mongoose = require('mongoose');
const async = require("async");
const moment = require('moment');
const Order = model.order;
const Orderdetail = model.order_detail;

module.exports = {
	getInvoiceData: async function(odid, cb) {
		let data = {};
		let orderData = await Order.findOne({ odid:odid });
		if(orderData) {
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

			orderData.siteLogo = config.constant.COMPANYLOGO;
			orderData.siteName = config.constant.SITENAME;
			orderData.clientGst = config.constant.CLIENT_GST_NO;
			orderData.clientState = config.constant.CLIENT_STATE;
			orderData.clientPan = config.constant.CLIENT_PAN;
			orderData.invoiceDate = moment().format('DD-MM-YYYY');
			orderData.invoiceNo = orderData.odid;
			orderData.referenceNo = 'N/A';

			let grandTotal = orderData.grandTotal ? orderData.grandTotal : 0; 
			let shipping = orderData.shipping ? orderData.shipping : 0; 
			let totalTax = orderData.totalTax ? orderData.totalTax : 0; 
			let totalAmount = (grandTotal + shipping + totalTax).toFixed(2);
			let couponAmount = orderData.couponAmount ? orderData.couponAmount : 0;
			totalAmount = totalAmount - couponAmount.toFixed(2);
			orderData.totalAmount = totalAmount;
			data.orderData = orderData;
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
			
			data.orderDetailData = orderDetailData;
			cb(data);
		}
		else{
			cb('');
		}
	}
};


