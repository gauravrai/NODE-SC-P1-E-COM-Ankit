const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const mongoose = require('mongoose');
const moment = require('moment');
const excel = require('exceljs');
const ADMINCALLURL = config.constant.ADMINCALLURL;
const Role = model.role;
const Admin = model.admin;
const Brand = model.brand;
const Category = model.category;
const Subcategory = model.sub_category;
const State = model.state;
const City = model.city;
const Pincode = model.pincode;
const Area = model.area;
const Society = model.society;
const Tower = model.tower;
const Store = model.store;
const Contact = model.contact;
const Customer = model.customer;
const Discount = model.discount;
const Product = model.product;
const Varient = model.varient;
const RequestProduct = model.request_product;
const Order = model.order;
const OrderDetail = model.order_detail;

module.exports = {
	exportRole: async function(req,res){
		let roleData = await Role.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$project: {
					_id: 0,
					name: 1,
					description: 1,
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					name: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Role Master");
		
		worksheet.columns = [
			{ header: "Name", key: "name", width: 25 },
			{ header: "Description", key: "description", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(roleData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "Role Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		});
  
		
	},

	exportAdminstrator: async function(req,res){
		let adminstratorData = await Admin.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$lookup: {
					from: "roles",
					localField: "roleId",
					foreignField: "_id",
					as: "roleData"
				}
			},
			{
				$project: {
					_id: 0,
					name: 1,
					email: 1,
					username: 1,
					role: { $arrayElemAt: ['$roleData.name', 0] } ,
					superadmin:
					{
						$cond: { if: true, then: 'Yes', else: 'No' }
					},
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					name: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Administrator Master");
		
		worksheet.columns = [
			{ header: "Name", key: "name", width: 25 },
			{ header: "Email", key: "email", width: 25 },
			{ header: "Username", key: "username", width: 25 },
			{ header: "Role", key: "role", width: 25 },
			{ header: "Superadmin", key: "superadmin", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(adminstratorData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "Administrator Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		})
	},
	
	exportBrand: async function(req,res){
		let brandData = await Brand.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$project: {
					_id: 0,
					name: 1,
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					name: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Brand Master");
		
		worksheet.columns = [
			{ header: "Name", key: "name", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(brandData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "Brand Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		});
	},
	
	exportCategory: async function(req,res){
		let categoryData = await Category.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$project: {
					_id: 0,
					name: 1,
					slug: 1,
					order: 1,
					image:
					{
						$cond: { if: '$image.large' != '', then: 'Yes', else: 'No' }
					},
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					name: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Category Master");
		
		worksheet.columns = [
			{ header: "Name", key: "name", width: 25 },
			{ header: "Slug", key: "slug", width: 25 },
			{ header: "Order", key: "order", width: 25 },
			{ header: "Image", key: "image", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(categoryData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "Category Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		});
	},
	
	exportSubcategory: async function(req,res){
		let subcategoryData = await Subcategory.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$lookup: {
					from: "categories",
					localField: "categoryId",
					foreignField: "_id",
					as: "categoryData"
				}
			},
			{
				$project: {
					_id: 0,
					name: 1,
					slug: 1,
					order: 1,
					category: { $arrayElemAt: ['$categoryData.name', 0] } ,
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					name: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Subcategory Master");
		
		worksheet.columns = [
			{ header: "Name", key: "name", width: 25 },
			{ header: "Slug", key: "slug", width: 25 },
			{ header: "Order", key: "order", width: 25 },
			{ header: "Category", key: "category", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(subcategoryData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "Subcategory Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		})
	},
	
	exportState: async function(req,res){
		let stateData = await State.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$project: {
					_id: 0,
					name: 1,
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					name: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("State Master");
		
		worksheet.columns = [
			{ header: "Name", key: "name", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(stateData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "State Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		})
	},
	
	exportCity: async function(req,res){
		let cityData = await City.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$lookup: {
					from: "states",
					localField: "stateId",
					foreignField: "_id",
					as: "stateData"
				}
			},
			{
				$project: {
					_id: 0,
					name: 1,
					state: { $arrayElemAt: ['$stateData.name', 0] },
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					name: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("City Master");
		
		worksheet.columns = [
			{ header: "Name", key: "name", width: 25 },
			{ header: "State", key: "state", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(cityData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "City Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		})
	},
	
	exportPincode: async function(req,res){
		let pincodeData = await Pincode.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$lookup: {
					from: "states",
					localField: "stateId",
					foreignField: "_id",
					as: "stateData"
				}
			},
			{
				$lookup: {
					from: "cities",
					localField: "cityId",
					foreignField: "_id",
					as: "cityData"
				}
			},
			{
				$project: {
					_id: 0,
					pincode: 1,
					state: { $arrayElemAt: ['$stateData.name', 0] },
					city: { $arrayElemAt: ['$cityData.name', 0] },
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					pincode: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Pincode Master");
		
		worksheet.columns = [
			{ header: "Pincode", key: "pincode", width: 25 },
			{ header: "State", key: "state", width: 25 },
			{ header: "City", key: "city", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(pincodeData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "Pincode Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		})
	},
	
	exportArea: async function(req,res){
		let areaData = await Area.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$lookup: {
					from: "states",
					localField: "stateId",
					foreignField: "_id",
					as: "stateData"
				}
			},
			{
				$lookup: {
					from: "cities",
					localField: "cityId",
					foreignField: "_id",
					as: "cityData"
				}
			},
			{
				$lookup: {
					from: "pincodes",
					localField: "pincodeId",
					foreignField: "_id",
					as: "pincodeData"
				}
			},
			{
				$project: {
					_id: 0,
					name: 1,
					state: { $arrayElemAt: ['$stateData.name', 0] },
					city: { $arrayElemAt: ['$cityData.name', 0] },
					pincode: { $arrayElemAt: ['$pincodeData.pincode', 0] },
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					name: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Area Master");
		
		worksheet.columns = [
			{ header: "Name", key: "name", width: 25 },
			{ header: "State", key: "state", width: 25 },
			{ header: "City", key: "city", width: 25 },
			{ header: "Pincode", key: "pincode", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(areaData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "Area Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		})
	},
	
	exportSociety: async function(req,res){
		let societyData = await Society.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$lookup: {
					from: "states",
					localField: "stateId",
					foreignField: "_id",
					as: "stateData"
				}
			},
			{
				$lookup: {
					from: "cities",
					localField: "cityId",
					foreignField: "_id",
					as: "cityData"
				}
			},
			{
				$lookup: {
					from: "pincodes",
					localField: "pincodeId",
					foreignField: "_id",
					as: "pincodeData"
				}
			},
			{
				$lookup: {
					from: "areas",
					localField: "areaId",
					foreignField: "_id",
					as: "areaData"
				}
			},
			{
				$project: {
					_id: 0,
					name: 1,
					state: { $arrayElemAt: ['$stateData.name', 0] },
					city: { $arrayElemAt: ['$cityData.name', 0] },
					pincode: { $arrayElemAt: ['$pincodeData.pincode', 0] },
					area: { $arrayElemAt: ['$areaData.name', 0] },
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					name: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Society Master");
		
		worksheet.columns = [
			{ header: "Name", key: "name", width: 25 },
			{ header: "State", key: "state", width: 25 },
			{ header: "City", key: "city", width: 25 },
			{ header: "Pincode", key: "pincode", width: 25 },
			{ header: "Area", key: "area", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(societyData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "Society Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		})
	},
	
	exportTower: async function(req,res){
		let TowerData = await Tower.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$lookup: {
					from: "states",
					localField: "stateId",
					foreignField: "_id",
					as: "stateData"
				}
			},
			{
				$lookup: {
					from: "cities",
					localField: "cityId",
					foreignField: "_id",
					as: "cityData"
				}
			},
			{
				$lookup: {
					from: "pincodes",
					localField: "pincodeId",
					foreignField: "_id",
					as: "pincodeData"
				}
			},
			{
				$lookup: {
					from: "areas",
					localField: "areaId",
					foreignField: "_id",
					as: "areaData"
				}
			},
			{
				$lookup: {
					from: "societies",
					localField: "societyId",
					foreignField: "_id",
					as: "societyData"
				}
			},
			{
				$project: {
					_id: 0,
					name: 1,
					state: { $arrayElemAt: ['$stateData.name', 0] },
					city: { $arrayElemAt: ['$cityData.name', 0] },
					pincode: { $arrayElemAt: ['$pincodeData.pincode', 0] },
					area: { $arrayElemAt: ['$areaData.name', 0] },
					society: { $arrayElemAt: ['$societyData.name', 0] },
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					name: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Tower Master");
		
		worksheet.columns = [
			{ header: "Name", key: "name", width: 25 },
			{ header: "State", key: "state", width: 25 },
			{ header: "City", key: "city", width: 25 },
			{ header: "Pincode", key: "pincode", width: 25 },
			{ header: "Area", key: "area", width: 25 },
			{ header: "Society", key: "society", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(TowerData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "Tower Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		})
	},
	
	exportStore: async function(req,res){
		let storeData = await Store.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$lookup: {
					from: "states",
					localField: "stateId",
					foreignField: "_id",
					as: "stateData"
				}
			},
			{
				$lookup: {
					from: "cities",
					localField: "cityId",
					foreignField: "_id",
					as: "cityData"
				}
			},
			{
				$project: {
					_id: 0,
					name: 1,
					contactName: 1,
					contactNumber: 1,
					address: 1,
					state: { $arrayElemAt: ['$stateData.name', 0] },
					city: { $arrayElemAt: ['$cityData.name', 0] },
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					name: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Store Master");
		
		worksheet.columns = [
			{ header: "Name", key: "name", width: 25 },
			{ header: "Contact Name", key: "contactName", width: 25 },
			{ header: "Contact Number", key: "contactNumber", width: 25 },
			{ header: "Address", key: "address", width: 25 },
			{ header: "State", key: "state", width: 25 },
			{ header: "City", key: "city", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(storeData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "Store Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		});
	},
	
	exportProductRequest: async function(req,res){
		let requestProductData = await RequestProduct.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$lookup: {
					from: "products",
					localField: "productId",
					foreignField: "_id",
					as: "productName"
				}
			},
			{
				$project: {
					_id: 0,
					registeredUser:
					{
						$cond: { if: '$userId', then: 'Yes', else: 'No' }
					},
					name: 1,
					email: 1,
					address: 1,
					pincode: 1,
					description: 1,
					productName: { $arrayElemAt: ['$productName.name', 0] },
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					name: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Requested Product Master");
		
		worksheet.columns = [
			{ header: "Registered User", key: "registeredUser", width: 25 },
			{ header: "Name", key: "name", width: 25 },
			{ header: "Email", key: "email", width: 25 },
			{ header: "Address", key: "address", width: 25 },
			{ header: "Pincode", key: "pincode", width: 25 },
			{ header: "Description", key: "description", width: 25 },
			{ header: "Product Name", key: "productName", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(requestProductData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "Requested Product Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		})
	},
	
	exportVarient: async function(req,res){
		let varientData = await Varient.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$project: {
					_id: 0,
					label: 1,
					measurementUnit: 1,
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					name: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Varient Master");
		
		worksheet.columns = [
			{ header: "Label", key: "label", width: 25 },
			{ header: "Measurement Unit", key: "measurementUnit", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(varientData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "Varient Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		})
	},
	
	exportCustomer: async function(req,res){
		let customerData = await Customer.aggregate([
			{
				$match: {deletedAt: 0}
			},
			{
				$project: {
					_id: 0,
					name: 1,
					email: 1,
					mobile: 1,
					sameAsBillingAddress:
					{
						$cond: { if: true, then: 'Yes', else: 'No' }
					},
					status:
					{
						$cond: { if: true, then: 'Active', else: 'Inactive' }
					},
					createdAt: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
				}
			},
			{
				$sort: {
					name: 1
				}
			}
		]);
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Customer Master");
		
		worksheet.columns = [
			{ header: "Name", key: "name", width: 25 },
			{ header: "Email", key: "email", width: 25 },
			{ header: "Mobile", key: "mobile", width: 25 },
			{ header: "Same As Billing Address", key: "sameAsBillingAddress", width: 25 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Created Date", key: "createdAt", width: 20 }
		];

		worksheet.addRows(customerData);
		
		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "Customer Master.xlsx"
		);
		
		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		})
	},
}