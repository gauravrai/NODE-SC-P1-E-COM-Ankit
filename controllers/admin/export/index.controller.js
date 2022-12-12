const model = require("../../../models/index.model");
const config = require("../../../config/index");
const mongoose = require("mongoose");
const moment = require("moment");
const excel = require("exceljs");
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
const Wallet = model.wallet;
const Walletentry = model.wallet_entry;
const Stock = model.stock;
const Stockentry = model.stock_entries;
const Notification = model.notification;
const IpAddress = model.ip_address;
const Profile = model.profile;

module.exports = {
    exportRole: async function(req, res) {
        let roleData = await Role.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    description: 1,
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Role Master");

        worksheet.columns = [
            { header: "Name", key: "name", width: 25 },
            { header: "Description", key: "description", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
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

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportAdminstrator: async function(req, res) {
        let adminstratorData = await Admin.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $lookup: {
                    from: "roles",
                    localField: "roleId",
                    foreignField: "_id",
                    as: "roleData",
                },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    email: 1,
                    username: 1,
                    role: { $arrayElemAt: ["$roleData.name", 0] },
                    superadmin: {
                        $cond: { if: true, then: "Yes", else: "No" },
                    },
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
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
            { header: "Created Date", key: "createdAt", width: 20 },
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

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportBrand: async function(req, res) {
        let brandData = await Brand.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Brand Master");

        worksheet.columns = [
            { header: "Name", key: "name", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
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

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportCategory: async function(req, res) {
        let categoryData = await Category.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    slug: 1,
                    order: 1,
                    image: {
                        $cond: { if: "$image.large" != "", then: "Yes", else: "No" },
                    },
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Category Master");

        worksheet.columns = [
            { header: "Name", key: "name", width: 25 },
            { header: "Slug", key: "slug", width: 25 },
            { header: "Order", key: "order", width: 25 },
            { header: "Image", key: "image", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
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

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportSubcategory: async function(req, res) {
        let subcategoryData = await Subcategory.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    slug: 1,
                    order: 1,
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Subcategory Master");

        worksheet.columns = [
            { header: "Name", key: "name", width: 25 },
            { header: "Slug", key: "slug", width: 25 },
            { header: "Order", key: "order", width: 25 },
            { header: "Category", key: "category", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
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

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportState: async function(req, res) {
        let stateData = await State.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("State Master");

        worksheet.columns = [
            { header: "Name", key: "name", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
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

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportCity: async function(req, res) {
        let cityData = await City.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "stateId",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("City Master");

        worksheet.columns = [
            { header: "Name", key: "name", width: 25 },
            { header: "State", key: "state", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
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

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportPincode: async function(req, res) {
        let pincodeData = await Pincode.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "stateId",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "cities",
                    localField: "cityId",
                    foreignField: "_id",
                    as: "cityData",
                },
            },
            {
                $project: {
                    _id: 0,
                    pincode: 1,
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    city: { $arrayElemAt: ["$cityData.name", 0] },
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    pincode: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Pincode Master");

        worksheet.columns = [
            { header: "Pincode", key: "pincode", width: 25 },
            { header: "State", key: "state", width: 25 },
            { header: "City", key: "city", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
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

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportArea: async function(req, res) {
        let areaData = await Area.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "stateId",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "cities",
                    localField: "cityId",
                    foreignField: "_id",
                    as: "cityData",
                },
            },
            {
                $lookup: {
                    from: "pincodes",
                    localField: "pincodeId",
                    foreignField: "_id",
                    as: "pincodeData",
                },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    city: { $arrayElemAt: ["$cityData.name", 0] },
                    pincode: { $arrayElemAt: ["$pincodeData.pincode", 0] },
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Area Master");

        worksheet.columns = [
            { header: "Name", key: "name", width: 25 },
            { header: "State", key: "state", width: 25 },
            { header: "City", key: "city", width: 25 },
            { header: "Pincode", key: "pincode", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
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

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportSociety: async function(req, res) {
        let societyData = await Society.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "stateId",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "cities",
                    localField: "cityId",
                    foreignField: "_id",
                    as: "cityData",
                },
            },
            {
                $lookup: {
                    from: "pincodes",
                    localField: "pincodeId",
                    foreignField: "_id",
                    as: "pincodeData",
                },
            },
            {
                $lookup: {
                    from: "areas",
                    localField: "areaId",
                    foreignField: "_id",
                    as: "areaData",
                },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    city: { $arrayElemAt: ["$cityData.name", 0] },
                    pincode: { $arrayElemAt: ["$pincodeData.pincode", 0] },
                    area: { $arrayElemAt: ["$areaData.name", 0] },
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
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
            { header: "Created Date", key: "createdAt", width: 20 },
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

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportTower: async function(req, res) {
        let towerData = await Tower.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "stateId",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "cities",
                    localField: "cityId",
                    foreignField: "_id",
                    as: "cityData",
                },
            },
            {
                $lookup: {
                    from: "pincodes",
                    localField: "pincodeId",
                    foreignField: "_id",
                    as: "pincodeData",
                },
            },
            {
                $lookup: {
                    from: "areas",
                    localField: "areaId",
                    foreignField: "_id",
                    as: "areaData",
                },
            },
            {
                $lookup: {
                    from: "societies",
                    localField: "societyId",
                    foreignField: "_id",
                    as: "societyData",
                },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    city: { $arrayElemAt: ["$cityData.name", 0] },
                    pincode: { $arrayElemAt: ["$pincodeData.pincode", 0] },
                    area: { $arrayElemAt: ["$areaData.name", 0] },
                    society: { $arrayElemAt: ["$societyData.name", 0] },
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
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
            { header: "Created Date", key: "createdAt", width: 20 },
        ];

        worksheet.addRows(towerData);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Tower Master.xlsx"
        );

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportStore: async function(req, res) {
        let storeData = await Store.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "stateId",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
            {
                $lookup: {
                    from: "cities",
                    localField: "cityId",
                    foreignField: "_id",
                    as: "cityData",
                },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    contactName: 1,
                    contactNumber: 1,
                    address: 1,
                    state: { $arrayElemAt: ["$stateData.name", 0] },
                    city: { $arrayElemAt: ["$cityData.name", 0] },
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
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
            { header: "Created Date", key: "createdAt", width: 20 },
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

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportProductRequest: async function(req, res) {
        let requestProductData = await RequestProduct.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productName",
                },
            },
            {
                $project: {
                    _id: 0,
                    registeredUser: {
                        $cond: { if: "$userId", then: "Yes", else: "No" },
                    },
                    name: 1,
                    email: 1,
                    address: 1,
                    pincode: 1,
                    description: 1,
                    productName: { $arrayElemAt: ["$productName.name", 0] },
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    productName: 1,
                },
            },
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
            { header: "Created Date", key: "createdAt", width: 20 },
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

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportVarient: async function(req, res) {
        let varientData = await Varient.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $project: {
                    _id: 0,
                    label: 1,
                    measurementUnit: 1,
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    measurementUnit: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Varient Master");

        worksheet.columns = [
            { header: "Label", key: "label", width: 25 },
            { header: "Measurement Unit", key: "measurementUnit", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
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

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportCustomer: async function(req, res) {
        let customerData = await Customer.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    email: 1,
                    mobile: 1,
                    sameAsBillingAddress: {
                        $cond: { if: true, then: "Yes", else: "No" },
                    },
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Customer Master");

        worksheet.columns = [
            { header: "Name", key: "name", width: 25 },
            { header: "Email", key: "email", width: 25 },
            { header: "Mobile", key: "mobile", width: 25 },
            {
                header: "Same As Billing Address",
                key: "sameAsBillingAddress",
                width: 25,
            },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
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

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportProduct: async function(req, res) {
        let productData = await Product.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData",
                },
            },
            {
                $lookup: {
                    from: "sub_categories",
                    localField: "subcategoryId",
                    foreignField: "_id",
                    as: "subcategoryData",
                },
            },
            {
                $lookup: {
                    from: "brands",
                    localField: "brandId",
                    foreignField: "_id",
                    as: "brandData",
                },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    subcategory: { $arrayElemAt: ["$subcategoryData.name", 0] },
                    brand: { $arrayElemAt: ["$brandData.name", 0] },
                    offer: 1,
                    discount: 1,
                    stock: 1,
                    description: 1,
                    featured: {
                        $cond: { if: true, then: "Yes", else: "No" },
                    },
                    outOfStock: {
                        $cond: { if: true, then: "Yes", else: "No" },
                    },
                    price: 1,
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Product Master");

        worksheet.columns = [
            { header: "Product Name", key: "name", width: 25 },
            { header: "Category", key: "category", width: 25 },
            { header: "Sub Category", key: "subcategory", width: 25 },
            { header: "Brand", key: "brand", width: 25 },
            { header: "Offer", key: "offer", width: 25 },
            { header: "Discount", key: "discount", width: 25 },
            { header: "Stock", key: "stock", width: 25 },
            { header: "Description", key: "description", width: 25 },
            { header: "Featured", key: "featured", width: 25 },
            { header: "Out Of Stock", key: "outOfStock", width: 25 },
            { header: "Price", key: "price", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
        ];

        worksheet.addRows(productData);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Product Master.xlsx"
        );

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportOrder: async function(req, res) {
        var search = { deletedAt: 0 };
        if (req.param("search_data")) {
            search.$or = [
                { odid: { $regex: req.param("search_data") } },
                {
                    "customerDetail.name": {
                        $regex: ".*" + req.param("search_data") + ".*",
                        $options: "i",
                    },
                },
                { "customerDetail.mobile": { $regex: req.param("search_data") } },
                { "customerDetail.address": { $regex: req.param("search_data") } },
            ];
        }
        if (req.param("order_status")) {
            search.orderStatus = req.param("order_status");
        }
        if (req.param("date_from") && req.param("date_to")) {
            var today = new Date(req.param("date_to"));
            var tomorrow = new Date(req.param("date_to"));
            tomorrow.setDate(today.getDate() + 1);
            var tomorrow = tomorrow.toLocaleDateString();
            search.createdAt = {
                $gte: new Date(req.param("date_from")),
                $lte: new Date(tomorrow),
            };
        }
        if (req.param("order_from")) {
            search.orderFrom = req.param("order_from");
        }
        let orderData = await Order.aggregate([{
                $match: search,
            },
            {
                $project: {
                    _id: 0,
                    odid: 1,
                    grandTotal: 1,
                    subTotal: 1,
                    shippingPrice: 1,
                    totalTax: 1,
                    couponAmount: 1,
                    taxType: {
                        $cond: { if: 1, then: "CGST/SGST", else: "IGST" },
                    },
                    quantity: 1,
                    orderStatus: 1,
                    orderFrom: 1,
                    paymentType: 1,
                    paymentStatus: 1,
                    timeSlot: 1,
                    deliveryDate: 1,
                    receiverName: 1,
                    customerDetail: 1,
                    customerName: "$customerDetail.name",
                    customerMobile: "$customerDetail.mobile",
                    customerEmail: "$customerDetail.email",
                    customerGst: "$customerDetail.gst",
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    createdAt: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Order Report");

        worksheet.columns = [
            { header: "ODID", key: "odid", width: 25 },
            { header: "Customer Name", key: "customerName", width: 25 },
            { header: "Customer Mobile", key: "customerMobile", width: 25 },
            { header: "Customer Email", key: "customerEmail", width: 25 },
            { header: "Customer Gst", key: "customerGst", width: 25 },
            { header: "Grand Total", key: "grandTotal", width: 25 },
            { header: "Sub Total", key: "subTotal", width: 25 },
            { header: "Shipping Price", key: "shippingPrice", width: 25 },
            { header: "totalTax", key: "totalTax", width: 25 },
            { header: "Coupon Amount", key: "couponAmount", width: 25 },
            { header: "Tax Type", key: "taxType", width: 25 },
            { header: "Quantity", key: "quantity", width: 25 },
            { header: "Order Status", key: "orderStatus", width: 25 },
            { header: "Order From", key: "orderFrom", width: 25 },
            { header: "Payment Type", key: "paymentType", width: 25 },
            { header: "Payment Status", key: "paymentStatus", width: 25 },
            { header: "Time Slot", key: "timeSlot", width: 25 },
            { header: "Delivery Date", key: "deliveryDate", width: 25 },
            { header: "Receiver Name", key: "receiverName", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
        ];
        worksheet.addRows(orderData);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Order Report.xlsx"
        );

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportWallet: async function(req, res) {
        let search = { deletedAt: 0 };
        if (req.param("date_from") && req.param("date_to")) {
            let today = new Date(req.param("date_to"));
            let tomorrow = new Date(req.param("date_to"));
            tomorrow.setDate(today.getDate() + 1);
            tomorrow = tomorrow.toLocaleDateString();
            search.updatedAt = {
                $gte: new Date(req.param("date_from")),
                $lte: new Date(tomorrow),
            };
        }
        let data = await Wallet.find(search).sort({ updatedAt: 1 });
        let walletData = [];
        for (i = 0; i < data.length; i++) {
            let arr = {};
            let creditSearch = {
                userId: mongoose.mongo.ObjectId(data[i].userId),
                type: "Add",
            };
            let debitSearch = {
                userId: mongoose.mongo.ObjectId(data[i].userId),
                type: "Sub",
            };
            if (req.param("date_from") && req.param("date_to")) {
                let today = new Date(req.param("date_to"));
                let tomorrow = new Date(req.param("date_to"));
                tomorrow.setDate(today.getDate() + 1);
                tomorrow = tomorrow.toLocaleDateString();
                creditSearch.createdAt = {
                    $gte: new Date(req.param("date_from")),
                    $lte: new Date(tomorrow),
                };
                debitSearch.createdAt = {
                    $gte: new Date(req.param("date_from")),
                    $lte: new Date(tomorrow),
                };
            }
            await config.helpers.customer.getNameById(
                data[i].userId,
                async function(userName) {
                    let name = userName ? userName.name : "N/A";
                    arr.customerName = name;
                }
            );
            await config.helpers.customer.getMobileById(
                data[i].userId,
                async function(userMobile) {
                    let mobile = userMobile ? userMobile.mobile : "N/A";
                    arr.mobile = mobile;
                }
            );
            arr.amount = data[i].totalAmount;
            let creditCount = await Walletentry.countDocuments(creditSearch);
            let debitCount = await Walletentry.countDocuments(debitSearch);
            arr.creditCount = creditCount;
            arr.debitCount = debitCount;
            arr.status = data[i].status == true ? "Active" : "Inactive";
            arr.createdAt = moment(data[i].createdAt).format("DD-MM-YYYY");
            arr.updatedAt = moment(data[i].updatedAt).format("DD-MM-YYYY");
            walletData.push(arr);
        }
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Wallet Report");

        worksheet.columns = [
            { header: "Customer Name", key: "customerName", width: 25 },
            { header: "Mobile", key: "mobile", width: 25 },
            { header: "Total Amount", key: "amount", width: 25 },
            { header: "Credit Count", key: "creditCount", width: 25 },
            { header: "Debit Count", key: "debitCount", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
            { header: "Updated Date", key: "updatedAt", width: 20 },
        ];
        worksheet.addRows(walletData);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Wallet Report.xlsx"
        );

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportStock: async function(req, res) {
        let search = { deletedAt: 0 };
        if (req.param("date_from") && req.param("date_to")) {
            let today = new Date(req.param("date_to"));
            let tomorrow = new Date(req.param("date_to"));
            tomorrow.setDate(today.getDate() + 1);
            tomorrow = tomorrow.toLocaleDateString();
            search.updatedAt = {
                $gte: new Date(req.param("date_from")),
                $lte: new Date(tomorrow),
            };
        }
        let data = await Stock.find(search).sort({ updatedAt: 1 });
        let stockData = [];
        for (i = 0; i < data.length; i++) {
            console.log(data[i]);
            let arr = {};
            let creditSearch = {
                storeId: mongoose.mongo.ObjectId(data[i].storeId),
                productId: mongoose.mongo.ObjectId(data[i].productId),
                varientId: mongoose.mongo.ObjectId(data[i].varientId),
                transactionType: "in",
            };
            let debitSearch = {
                storeId: mongoose.mongo.ObjectId(data[i].storeId),
                productId: mongoose.mongo.ObjectId(data[i].productId),
                varientId: mongoose.mongo.ObjectId(data[i].varientId),
                transactionType: "out",
            };
            if (req.param("date_from") && req.param("date_to")) {
                let today = new Date(req.param("date_to"));
                let tomorrow = new Date(req.param("date_to"));
                tomorrow.setDate(today.getDate() + 1);
                tomorrow = tomorrow.toLocaleDateString();
                creditSearch.createdAt = {
                    $gte: new Date(req.param("date_from")),
                    $lte: new Date(tomorrow),
                };
                debitSearch.createdAt = {
                    $gte: new Date(req.param("date_from")),
                    $lte: new Date(tomorrow),
                };
            }
            await config.helpers.store.getNameById(
                data[i].storeId,
                async function(storeName) {
                    let store = storeName ? storeName.name : "N/A";
                    arr.store = store;
                }
            );
            await config.helpers.product.getNameById(
                data[i].productId,
                async function(productName) {
                    let product = productName ? productName.name : "N/A";
                    arr.product = product;
                }
            );
            await config.helpers.varient.getNameById(
                data[i].varientId,
                async function(varientName) {
                    let varient = varientName ?
                        varientName.label + " " + varientName.measurementUnit :
                        "N/A";
                    arr.varient = varient;
                }
            );
            arr.costPrice = data[i].costPrice;
            arr.totalCount = data[i].count;
            let creditCount = await Stockentry.countDocuments(creditSearch);
            let debitCount = await Stockentry.countDocuments(debitSearch);
            arr.creditCount = creditCount;
            arr.debitCount = debitCount;
            arr.status = data[i].status == true ? "Active" : "Inactive";
            arr.createdAt = moment(data[i].createdAt).format("DD-MM-YYYY");
            arr.updatedAt = moment(data[i].updatedAt).format("DD-MM-YYYY");
            stockData.push(arr);
        }
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Stock Report");

        worksheet.columns = [
            { header: "Store", key: "store", width: 25 },
            { header: "Product", key: "product", width: 25 },
            { header: "Varient", key: "varient", width: 25 },
            { header: "Cost Price", key: "costPrice", width: 25 },
            { header: "Total Available Quantity", key: "totalCount", width: 25 },
            { header: "Credit Count", key: "creditCount", width: 25 },
            { header: "Debit Count", key: "debitCount", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
            { header: "Updated Date", key: "updatedAt", width: 20 },
        ];
        worksheet.addRows(stockData);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Stock Report.xlsx"
        );

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportStockDetails: async function(req, res) {
        let productId = req.param("productId");
        let varientId = req.param("varientId");
        let storeId = req.param("storeId");
        let stockDetailData = await Stockentry.aggregate([{
                $match: {
                    productId: mongoose.mongo.ObjectId(productId),
                    varientId: mongoose.mongo.ObjectId(varientId),
                    storeId: mongoose.mongo.ObjectId(storeId),
                    deletedAt: 0,
                    status: true,
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productData",
                },
            },
            {
                $lookup: {
                    from: "varients",
                    localField: "varientId",
                    foreignField: "_id",
                    as: "varientData",
                },
            },
            {
                $lookup: {
                    from: "stocks",
                    localField: "stockId",
                    foreignField: "_id",
                    as: "stockData",
                },
            },
            {
                $project: {
                    _id: 0,
                    store: { $arrayElemAt: ["$storeData.name", 0] },
                    product: { $arrayElemAt: ["$productData.name", 0] },
                    varient: { $arrayElemAt: ["$varientData.label", 0] },
                    costPrice: 1,
                    count: 1,
                    transactionType: 1,
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    createdAt: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Stock Detail Report");

        worksheet.columns = [
            { header: "Store", key: "store", width: 25 },
            { header: "Product", key: "product", width: 25 },
            { header: "Varient", key: "varient", width: 25 },
            { header: "Cost Price", key: "costPrice", width: 25 },
            { header: "Quantity", key: "count", width: 25 },
            { header: "Transaction Type", key: "transactionType", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
        ];
        worksheet.addRows(stockDetailData);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Stock Detail Report.xlsx"
        );

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },

    exportNotification: async function(req, res) {
        let search = { deletedAt: 0 };
        let data = await Notification.find(search).sort({ updatedAt: 1 });
        let notificationData = [];
        for (i = 0; i < data.length; i++) {
            let arr = {};
            arr.message = data[i].message;
            arr.createdAt = moment(data[i].createdAt).format("DD-MM-YYYY");
            arr.expiryDate = moment(data[i].expiryDate).format("DD-MM-YYYY");
            let userType =
                data[i].userType == "allUser" ? "All User" : "Selected User";
            arr.userType = userType;

            let condition = {};
            if (data[i].userType == "selectedUser") {
                let userIdArr = [];
                for (let j = 0; j < data[i].userId.length; j++) {
                    userIdArr.push(mongoose.mongo.ObjectId(data[i].userId[j]));
                }
                condition = { _id: { $in: userIdArr } };
            }
            console.log("-----------condition------------", condition);
            let customerData = await Customer.find(condition, { name: 1 });
            let userId = [];
            for (let k = 0; k < customerData.length; k++) {
                userId.push(customerData[k].name.toString());
            }
            arr.userName = userId;
            notificationData.push(arr);
        }
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Wallet Report");

        worksheet.columns = [
            { header: "Message", key: "message", width: 25 },
            { header: "Created Date", key: "createdAt", width: 20 },
            { header: "Expiry Date", key: "expiryDate", width: 20 },
            { header: "User Type", key: "userType", width: 25 },
            { header: "User Name", key: "userName", width: 25 },
        ];
        worksheet.addRows(notificationData);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Notification Report.xlsx"
        );

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },
    exportIpAddress: async function(req, res) {
        let ipAddressData = await IpAddress.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $lookup: {
                    from: "brands",
                    localField: "brandId",
                    foreignField: "_id",
                    as: "brandData",
                },
            },
            {
                $project: {
                    _id: 0,
                    ipAddress: 1,
                    order: 1,
                    brand: { $arrayElemAt: ["$brandData.name", 0] },
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    ipAddress: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("IP Address Master");

        worksheet.columns = [
            { header: "IP Address", key: "ipAddress", width: 25 },
            { header: "Order", key: "order", width: 25 },
            { header: "Brand", key: "brand", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
        ];

        worksheet.addRows(ipAddressData);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "IPAddress Master.xlsx"
        );

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },
    exportProfile: async function(req, res) {
        let profileData = await Profile.aggregate([{
                $match: { deletedAt: 0 },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    order: 1,
                    status: {
                        $cond: { if: true, then: "Active", else: "Inactive" },
                    },
                    createdAt: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ]);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Profile Master");

        worksheet.columns = [
            { header: "Name", key: "name", width: 25 },
            { header: "Order", key: "order", width: 25 },
            { header: "Status", key: "status", width: 10 },
            { header: "Created Date", key: "createdAt", width: 20 },
        ];

        worksheet.addRows(profileData);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Profile Master.xlsx"
        );

        return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
        });
    },
};