const model = require("../../../models/index.model");
const config = require("../../../config/index");
const db = config.connection;
const async = require("async");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const excel = require("exceljs");
var XLSX = require("xlsx");
const Admin = model.admin;
const Category = model.category;
const SubCategory = model.sub_category;
const Store = model.store;
const State = model.state;
const Product = model.product;
const Brand = model.brand;
const Varient = model.varient;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
    manageProduct: async function(req, res) {
        let moduleName = "Product Management";
        let pageTitle = "Manage Product";
        var detail = {};
        detail = { message: req.flash("msg") };
        await config.helpers.permission(
            "manage_product",
            req,
            (err, permissionData) => {
                res.render("admin/product/view.ejs", {
                    layout: "admin/layout/layout",
                    pageTitle: pageTitle,
                    moduleName: moduleName,
                    detail: detail,
                    permissionData: permissionData,
                });
            }
        );
    },

    listProduct: function(req, res) {
        var search = { deletedAt: 0 };
        let searchValue = req.body.search.value;
        if (searchValue) {
            search.name = { $regex: ".*" + searchValue + ".*", $options: "i" };
        }

        let skip = req.input("start") ? parseInt(req.input("start")) : 0;
        let limit = req.input("length") ?
            parseInt(req.input("length")) :
            config.constant.LIMIT;
        async.parallel({
                count: function(callback) {
                    Product.countDocuments(search)
                        .sort({ createdAt: -1 })
                        .exec(function(err, data_count) {
                            callback(null, data_count);
                        });
                },
                data: function(callback) {
                    Product.find(search)
                        .skip(skip)
                        .limit(limit)
                        .sort({ createdAt: -1 })
                        .exec(function(err, data) {
                            callback(null, data);
                        });
                },
            },
            async function(err, results) {
                var obj = {};
                obj.draw = req.body.draw;
                obj.recordsTotal = results.count ? results.count : 0;
                obj.recordsFiltered = results.count ? results.count : 0;
                var data = results.data ? results.data : [];
                var arr = [];
                var perdata = { add: 1, edit: 1, delete: 1 };
                await config.helpers.permission(
                    "manage_product",
                    req,
                    async function(err, permissionData) {
                        for (i = 0; i < data.length; i++) {
                            var arr1 = [];
                            if (data[i].image) {
                                let src =
                                    config.constant.PRODUCTTHUMBNAILSHOWPATH +
                                    data[i].image.thumbnail[0];
                                arr1.push('<img src="' + src + '" width="50px" height="50px">');
                            } else {
                                arr1.push("");
                            }
                            await config.helpers.category.getNameById(
                                data[i].categoryId,
                                async function(categoryName) {
                                    var cat_name = categoryName ? categoryName.name : "N/A";
                                    arr1.push(cat_name);
                                }
                            );
                            await config.helpers.subcategory.getNameById(
                                data[i].subcategoryId,
                                async function(subcategoryName) {
                                    var subcat_name = subcategoryName ?
                                        subcategoryName.name :
                                        "N/A";
                                    arr1.push(subcat_name);
                                }
                            );
                            arr1.push(data[i].name);
                            arr1.push(data[i].stock);
                            arr1.push(moment(data[i].createdAt).format("DD-MM-YYYY"));
                            if (!data[i].status) {
                                let change_status =
                                    "changeStatus(this,'1','change_status_product','list_product','product');";
                                arr1.push(
                                    '<span class="badge bg-danger" style="cursor:pointer;" onclick="' +
                                    change_status +
                                    '" id="' +
                                    data[i]._id +
                                    '">Inactive</span>'
                                );
                            } else {
                                let change_status =
                                    "changeStatus(this,'0','change_status_product','list_product','product');";
                                arr1.push(
                                    '<span class="badge bg-success" style="cursor:pointer;" onclick="' +
                                    change_status +
                                    '" id="' +
                                    data[i]._id +
                                    '">Active</span>'
                                );
                            }
                            let $but_edit = "-";
                            if (permissionData.edit == "1") {
                                $but_edit =
                                    '<span><a href="' +
                                    ADMINCALLURL +
                                    "/edit_product?id=" +
                                    data[i]._id +
                                    '" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
                            }
                            let $but_delete = " - ";
                            if (permissionData.delete == "1") {
                                let remove =
                                    "deleteData(this,'delete_product','list_product','product');";
                                $but_delete =
                                    '&nbsp;&nbsp;<span><a href="javascript:void(0)" class="btn btn-flat btn-info btn-outline-danger" title="Delete" onclick="' +
                                    remove +
                                    '" id="' +
                                    data[i]._id +
                                    '"><i class="fas fa fa-trash" ></i></a></span>';
                            }
                            arr1.push($but_edit + $but_delete);
                            arr.push(arr1);
                        }
                        obj.data = arr;
                        res.send(obj);
                    }
                );
            }
        );
    },

    addProduct: async function(req, res) {
        if (req.method == "GET") {
            let moduleName = "Product Management";
            let pageTitle = "Add Product";
            let categoryData = await Category.find({ status: true, deletedAt: 0 });
            let storeData = await Store.find({ status: true, deletedAt: 0 });
            let brandData = await Brand.find({ status: true, deletedAt: 0 });
            let varientData = await Varient.find({ status: true, deletedAt: 0 });
            res.render("admin/product/add.ejs", {
                layout: "admin/layout/layout",
                pageTitle: pageTitle,
                moduleName: moduleName,
                storeData: storeData,
                categoryData: categoryData,
                brandData: brandData,
                varientData: varientData,
            });
        } else {
            let previousProductData = await Product.find()
                .sort({ createdAt: -1 })
                .limit(1);

            function generateCode() {
                if (previousProductData.length > 0) {
                    let length = previousProductData[0].inventory[0].length;
                    let code = previousProductData[0].inventory[0][length - 1].uniqueCode;
                    return code;
                } else {
                    return "LB1000001";
                }
            }
            let productData = {};
            let uniqueCode = generateCode();
            uniqueCode = uniqueCode.substr(2);
            if (previousProductData.length > 0) {
                uniqueCode++;
            }
            let searchTag = req.body.searchTag ? req.body.searchTag.split(",") : [];
            productData = {
                // categoryId : mongoose.mongo.ObjectId(req.body.categoryId),
                name: req.body.name,
                offer: req.body.offer,
                discount: req.body.discount,
                stock: uniqueCode ? "LB" + uniqueCode++ : "",
                description: req.body.description,
                featured: req.body.featured == "on" ? true : false,
                outOfStock: req.body.outOfStock == "on" ? true : false,
                tax: req.body.tax,
                searchTag: searchTag,
            };
            if (req.body.subcategoryId) {
                productData.subcategoryId = mongoose.mongo.ObjectId(
                    req.body.subcategoryId
                );
            }
            if (req.body.brandId) {
                productData.brandId = mongoose.mongo.ObjectId(req.body.brandId);
            }
            let store = req.body.store;
            let storeId = req.body.storeId;
            let inventory = [];
            let price = 0;
            for (let i = 0; i < store; i++) {
                let varientArr = req.body["varient_" + i];
                if (varientArr != "") {
                    varientArr = Array.isArray(req.body["varient_" + i]) ?
                        req.body["varient_" + i] :
                        req.body["varient_" + i].split();
                }
                let priceArr = req.body["price_" + i];
                if (priceArr != "") {
                    priceArr = Array.isArray(req.body["price_" + i]) ?
                        req.body["price_" + i] :
                        req.body["price_" + i].split();
                }
                let defaultArr = req.body["default_" + i];
                let storeData = [];
                if (varientArr.length > 0) {
                    for (let j = 0; j < varientArr.length; j++) {
                        if (varientArr[j] != "" && priceArr[j] != "") {
                            let varientData = await Varient.findOne({
                                _id: mongoose.mongo.ObjectID(varientArr[j]),
                            });
                            let storeFieldObj = {
                                uniqueCode: "LB" + uniqueCode++,
                                varientId: mongoose.mongo.ObjectID(varientArr[j]),
                                storeId: mongoose.mongo.ObjectID(storeId[i]),
                                varient: varientData.label + " " + varientData.measurementUnit,
                                price: priceArr[j],
                                default: defaultArr == j ? true : false,
                            };
                            if (defaultArr == j) {
                                price = priceArr[j];
                            }
                            storeData.push(storeFieldObj);
                        }
                    }
                } else {
                    let storeFieldObj = {
                        varientId: "",
                        storeId: mongoose.mongo.ObjectID(storeId[i]),
                        varient: "",
                        price: 0,
                        default: false,
                    };
                    storeData.push(storeFieldObj);
                }
                inventory.push(storeData);
            }
            productData.inventory = inventory;
            productData.price = price;
            let imageLength = req.body.imageLength;
            let thumbnailArr = req.files.thumbnail;
            let smallArr = req.files.small;
            let largeArr = req.files.large;
            if (!Array.isArray(thumbnailArr)) {
                thumbnailArr = [thumbnailArr];
            }
            if (!Array.isArray(smallArr)) {
                smallArr = [smallArr];
            }
            if (!Array.isArray(largeArr)) {
                largeArr = [largeArr];
            }
            let image = {};
            new Promise(function(resolve, reject) {
                    let thumbnailImage = [];
                    let i = 0;
                    let thumbnailPath = config.constant.PRODUCTTHUMBNAILUPLOADPATH;
                    async.forEach(
                        thumbnailArr,
                        function(thumbnail, callback) {
                            let thumbnailName = Date.now() + "_" + thumbnail.name;
                            thumbnailImage[i++] = thumbnailName;
                            thumbnail.mv(thumbnailPath + thumbnailName, function(err, data) {
                                if (err) {
                                    console.log(err);
                                    reject(err);
                                } else {
                                    callback();
                                }
                            });
                        },
                        function(err) {
                            image.thumbnail = thumbnailImage;
                            resolve();
                        }
                    );
                })
                .then(async() => {
                    new Promise(function(resolve1, reject1) {
                        let smallImage = [];
                        let i = 0;
                        let smallPath = config.constant.PRODUCTSMALLUPLOADPATH;
                        async.forEach(
                            smallArr,
                            function(small, callback) {
                                let smallName = Date.now() + "_" + small.name;
                                smallImage[i++] = smallName;
                                small.mv(smallPath + smallName, function(err, data) {
                                    if (err) {
                                        console.log(err);
                                        reject1(err);
                                    } else {
                                        callback();
                                    }
                                });
                            },
                            function(err) {
                                image.small = smallImage;
                                resolve1();
                            }
                        );
                    }).then(async() => {
                        new Promise(function(resolve2, reject2) {
                            let largeImage = [];
                            let i = 0;
                            let largePath = config.constant.PRODUCTLARGEUPLOADPATH;
                            async.forEach(
                                largeArr,
                                function(large, callback) {
                                    let largeName = Date.now() + "_" + large.name;
                                    largeImage[i++] = largeName;
                                    large.mv(largePath + largeName, function(err, data) {
                                        if (err) {
                                            console.log(err);
                                            reject2(err);
                                        } else {
                                            callback();
                                        }
                                    });
                                },
                                function(err) {
                                    image.large = largeImage;
                                    resolve2();
                                }
                            );
                        }).then(async() => {
                            productData.image = image;
                            let product = new Product(productData);
                            product.save(function(err, data) {
                                if (err) {
                                    console.log(err);
                                }
                                req.flash("msg", {
                                    msg: "Product has been Created Successfully",
                                    status: true,
                                });
                                res.redirect(config.constant.ADMINCALLURL + "/manage_product");
                                req.flash({});
                            });
                        });
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    },

    editProduct: async function(req, res) {
        if (req.method == "GET") {
            let moduleName = "Product Management";
            let pageTitle = "Edit Product";
            let id = req.body.id;
            let categoryData = await Category.find({ status: true, deletedAt: 0 });
            let storeData = await Store.find({ status: true, deletedAt: 0 });
            let subcategoryData = await SubCategory.find({
                status: true,
                deletedAt: 0,
            });
            let brandData = await Brand.find({ status: true, deletedAt: 0 });
            let productData = await Product.findOne({
                _id: mongoose.mongo.ObjectId(id),
                deletedAt: 0,
            });
            let varientData = await Varient.find({ status: true, deletedAt: 0 });
            res.render("admin/product/edit", {
                layout: "admin/layout/layout",
                pageTitle: pageTitle,
                moduleName: moduleName,
                categoryData: categoryData,
                subcategoryData: subcategoryData,
                storeData: storeData,
                brandData: brandData,
                productData: productData,
                varientData: varientData,
            });
        }
        if (req.method == "POST") {
            let previousProductData = await Product.find()
                .sort({ createdAt: -1 })
                .limit(1);

            function generateCode() {
                if (previousProductData.length > 0) {
                    let length = previousProductData[0].inventory[0].length;
                    let code = previousProductData[0].inventory[0][length - 1].uniqueCode;
                    return code;
                } else {
                    return "LB1000001";
                }
            }
            let uniqueCode = generateCode();
            uniqueCode = uniqueCode.substr(2);
            if (previousProductData.length > 0) {
                uniqueCode++;
            }
            let productData = {};
            let searchTag = req.body.searchTag ? req.body.searchTag.split(",") : [];
            productData = {
                categoryId: mongoose.mongo.ObjectId(req.body.categoryId),
                name: req.body.name,
                offer: req.body.offer,
                discount: req.body.discount,
                stock: req.body.stock ? req.body.stock : "",
                description: req.body.description,
                featured: req.body.featured == "on" ? true : false,
                outOfStock: req.body.outOfStock == "on" ? true : false,
                tax: req.body.tax,
                searchTag: searchTag,
            };
            if (req.body.subcategoryId) {
                productData.subcategoryId = mongoose.mongo.ObjectId(
                    req.body.subcategoryId
                );
            }
            if (req.body.brandId) {
                productData.brandId = mongoose.mongo.ObjectId(req.body.brandId);
            }
            let store = req.body.store;
            let storeId = req.body.storeId;
            let inventory = [];
            let price = 0;
            for (let i = 0; i < store; i++) {
                let varientArr = req.body["varient_" + i];
                if (varientArr != "") {
                    varientArr = Array.isArray(req.body["varient_" + i]) ?
                        req.body["varient_" + i] :
                        req.body["varient_" + i].split();
                }
                let priceArr = req.body["price_" + i];
                if (priceArr != "") {
                    priceArr = Array.isArray(req.body["price_" + i]) ?
                        req.body["price_" + i] :
                        req.body["price_" + i].split();
                }
                let uniqueCodeArr = req.body["uniqueCode_" + i];
                if (uniqueCodeArr != "" && typeof uniqueCodeArr != "undefined") {
                    uniqueCodeArr = Array.isArray(req.body["uniqueCode_" + i]) ?
                        req.body["uniqueCode_" + i] :
                        req.body["uniqueCode_" + i].split();
                }
                let defaultArr = req.body["default_" + i];
                let storeData = [];
                if (varientArr.length > 0) {
                    for (let j = 0; j < varientArr.length; j++) {
                        if (varientArr[j] != "" && priceArr[j] != "") {
                            let varientData = await Varient.findOne({
                                _id: mongoose.mongo.ObjectID(varientArr[j]),
                            });
                            let storeFieldObj = {
                                uniqueCode: typeof uniqueCodeArr != "undefined" && uniqueCodeArr[j] ?
                                    uniqueCodeArr[j] :
                                    "LB" + uniqueCode++,
                                varientId: mongoose.mongo.ObjectID(varientArr[j]),
                                storeId: mongoose.mongo.ObjectID(storeId[i]),
                                varient: varientData.label + " " + varientData.measurementUnit,
                                price: priceArr[j],
                                default: defaultArr == j ? true : false,
                            };
                            if (defaultArr == j) {
                                price = priceArr[j];
                            }
                            storeData.push(storeFieldObj);
                        }
                    }
                } else {
                    let storeFieldObj = {
                        varientId: "",
                        storeId: mongoose.mongo.ObjectID(storeId[i]),
                        varient: "",
                        price: 0,
                        default: false,
                    };
                    storeData.push(storeFieldObj);
                }
                inventory.push(storeData);
            }
            productData.inventory = inventory;
            productData.price = price;
            if (Object.keys(req.files).length !== 0) {
                let imageLength = req.body.imageLength;
                let thumbnailArr = [];
                let smallArr = [];
                let largeArr = [];
                for (let i = 0; i <= imageLength.length; i++) {
                    let thumbnail = req.files["thumbnail_" + i];
                    let small = req.files["small_" + i];
                    let large = req.files["large_" + i];
                    new Promise(function(resolve, reject) {
                            if (typeof thumbnail != "undefined") {
                                let thumbnailPath = config.constant.PRODUCTTHUMBNAILUPLOADPATH;
                                let thumbnailName = Date.now() + "_" + thumbnail.name;
                                thumbnailArr[i] = thumbnailName;
                                thumbnail.mv(thumbnailPath + thumbnailName, function(err, data) {
                                    if (err) {
                                        console.log(err);
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            } else {
                                thumbnailArr[i] = req.body.thumbnailhidden[i];
                                resolve();
                            }
                        })
                        .then(async() => {
                            new Promise(function(resolve1, reject1) {
                                if (typeof small != "undefined") {
                                    let smallPath = config.constant.PRODUCTSMALLUPLOADPATH;
                                    let smallName = Date.now() + "_" + small.name;
                                    smallArr[i] = smallName;
                                    small.mv(smallPath + smallName, function(err, data) {
                                        if (err) {
                                            console.log(err);
                                            reject1(err);
                                        } else {
                                            resolve1();
                                        }
                                    });
                                } else {
                                    smallArr[i] = req.body.smallhidden[i];
                                    resolve1();
                                }
                            }).then(async() => {
                                new Promise(function(resolve2, reject2) {
                                    if (typeof large != "undefined") {
                                        let largePath = config.constant.PRODUCTLARGEUPLOADPATH;
                                        let largeName = Date.now() + "_" + large.name;
                                        largeArr[i] = largeName;
                                        large.mv(largePath + largeName, function(err, data) {
                                            if (err) {
                                                console.log(err);
                                                reject2(err);
                                            } else {
                                                resolve2();
                                            }
                                        });
                                    } else {
                                        largeArr[i] = req.body.largehidden[i];
                                        resolve2();
                                    }
                                }).then(async() => {
                                    let data = {};
                                    let image = {
                                        thumbnail: thumbnailArr,
                                        small: smallArr,
                                        large: largeArr,
                                    };
                                    data.image = image;
                                    await Product.updateOne({ _id: mongoose.mongo.ObjectId(req.body.id) },
                                        data,
                                        function(err, data) {
                                            if (err) {
                                                console.log(err);
                                            }
                                        }
                                    );
                                });
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            }
            await Product.updateOne({ _id: mongoose.mongo.ObjectId(req.body.id) },
                productData,
                function(err, data) {
                    if (err) {
                        console.log(err);
                    }
                    req.flash("msg", {
                        msg: "Product has been Updated Successfully",
                        status: true,
                    });
                    res.redirect(config.constant.ADMINCALLURL + "/manage_product");
                    req.flash({});
                }
            );
        }
    },

    changeStatusProduct: function(req, res) {
        let id = req.param("id");
        let status = req.param("status");
        return Product.updateOne({ _id: mongoose.mongo.ObjectId(id) }, {
                status: parseInt(status) ? true : false,
            },
            function(err, data) {
                if (err) console.error(err);
                if (status == "1") {
                    let change_status =
                        "changeStatus(this,'0','change_status_product','list_product','product');";
                    res.send(
                        '<span class="badge bg-success" style="cursor:pointer;" onclick="' +
                        change_status +
                        '">Active</span>'
                    );
                } else {
                    let change_status =
                        "changeStatus(this,'1','change_status_product','list_product','product');";
                    res.send(
                        '<span class="badge bg-danger" style="cursor:pointer;" onclick="' +
                        change_status +
                        '">Inactive</span>'
                    );
                }
            }
        );
    },

    deleteProduct: async function(req, res) {
        let id = req.param("id");
        return Product.updateOne({ _id: mongoose.mongo.ObjectId(id) }, { deletedAt: 2 },
            function(err, data) {
                if (err) console.error(err);
                res.send("done");
            }
        );
    },

    checkStockkeeping: async function(req, res) {
        let stockkeeping = req.body.stock_keeping;
        let productData = await Product.find({
            stock_keeping: stockkeeping,
            status: true,
            deletedAt: 0,
        });
        if (productData.length > 0) {
            return res
                .status(200)
                .json({
                    code: 1,
                    status: "exists",
                    message: "Stock Keeping Unit Already Inserted !!",
                });
        } else {
            return res.status(200).json({ code: 0, status: "", message: "" });
        }
    },

    bulkUploadProduct: async function(req, res) {
        var detail = {};
        if (req.method == "GET") {
            let moduleName = "Product Management";
            let pageTitle = "Bulk Upload Product";
            let categoryData = await Category.find({ status: true, deletedAt: 0 });
            detail = { message: req.flash("msg") };
            res.render("admin/product/bulkuploadproduct.ejs", {
                layout: "admin/layout/layout",
                pageTitle: pageTitle,
                moduleName: moduleName,
                detail: detail,
                categoryData: categoryData,
            });
        }
        if (req.method == "POST") {
            new Promise(function(resolve, reject) {
                    let path = config.constant.PRODUCTCSVUPLOADPATH;
                    let fileName = Date.now() + "_" + req.files.uploadProduct.name;
                    req.files.uploadProduct.mv(path + fileName, function(err, data) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            resolve(fileName);
                        }
                    });
                })
                .then(async(result) => {
                    let workbook = XLSX.readFile(config.constant.PRODUCTCSVPATH + result);
                    let sheet_name_list = workbook.SheetNames;
                    let xlData = XLSX.utils.sheet_to_json(
                        workbook.Sheets[sheet_name_list[0]]
                    );
                    let headers = [];
                    for (var i in xlData[0]) {
                        headers.push(i);
                    }
                    if (xlData.length <= 0) {
                        req.flash("msg", {
                            msg: "File not Uploaded. Please try again.",
                            status: false,
                        });
                        res.redirect(config.constant.ADMINCALLURL + "/bulk_upload_product");
                    } else if (
                        headers[0] != "Product Name" ||
                        headers[1] != "Brand" ||
                        headers[2] != "Offer applicable" ||
                        headers[3] != "Discount applicable" ||
                        headers[4] != "Tax" ||
                        headers[5] != "Featured Product" ||
                        headers[6] != "Out Of Stock" ||
                        headers[7] != "Description" ||
                        headers[8] != "Varient" ||
                        headers[9] != "Price"
                    ) {
                        req.flash("msg", { msg: "Wrong XSLS File.", status: false });
                        res.redirect(config.constant.ADMINCALLURL + "/bulk_upload_product");
                    } else {
                        let successdata = [];
                        let errordata = [];
                        let image = {};
                        image.thumbnail = ["default_thumbnail.jpg"];
                        image.small = ["default_small.jpg"];
                        image.large = ["default_large.jpg"];
                        let storeData = await Store.find({ status: true, deletedAt: 0 });
                        for (let i = 0; i < xlData.length; i++) {
                            if (!/^[a-zA-Z0-9 .,()-]+$/.test(xlData[i]["Product Name"]) ||
                                xlData[i]["Product Name"] == "" ||
                                typeof xlData[i]["Product Name"] == "undefined"
                            ) {
                                errordata.push(xlData[i]);
                            } else if (
                                xlData[i]["Brand"] == "" ||
                                typeof xlData[i]["Brand"] == "undefined"
                            ) {
                                errordata.push(xlData[i]);
                            } else if (
                                xlData[i]["Offer applicable"] == "" ||
                                typeof xlData[i]["Offer applicable"] == "undefined"
                            ) {
                                errordata.push(xlData[i]);
                            } else if (
                                xlData[i]["Discount applicable"] == "" ||
                                typeof xlData[i]["Discount applicable"] == "undefined"
                            ) {
                                errordata.push(xlData[i]);
                            } else if (!/^[0-9]+$/.test(xlData[i]["Tax"])) {
                                errordata.push(xlData[i]);
                            } else if (!/^[a-zA-Z0-9 .,()-]+$/.test(xlData[i]["Description"]) ||
                                xlData[i]["Description"] == "" ||
                                typeof xlData[i]["Description"] == "undefined"
                            ) {
                                errordata.push(xlData[i]);
                            } else if (
                                xlData[i]["Varient"] == "" ||
                                typeof xlData[i]["Varient"] == "undefined"
                            ) {
                                errordata.push(xlData[i]);
                            } else if (
                                xlData[i]["Price"] == "" ||
                                typeof xlData[i]["Price"] == "undefined" ||
                                !/^[0-9]+$/.test(xlData[i]["Tax"])
                            ) {
                                errordata.push(xlData[i]["Price"]);
                            } else {
                                successdata.push(xlData[i]);
                                let previousProductData = await Product.find()
                                    .sort({ createdAt: -1 })
                                    .limit(1);

                                function generateCode() {
                                    if (previousProductData.length > 0) {
                                        let length = previousProductData[0].inventory[0].length;
                                        let code =
                                            previousProductData[0].inventory[0][length - 1]
                                            .uniqueCode;
                                        return code;
                                    } else {
                                        return "LB1000001";
                                    }
                                }
                                let uniqueCode = generateCode();
                                uniqueCode = uniqueCode.substr(2);
                                if (previousProductData.length > 0) {
                                    uniqueCode++;
                                }
                                let insertData = {
                                    categoryId: mongoose.mongo.ObjectId(req.body.categoryId),
                                    name: xlData[i]["Product Name"],
                                    offer: xlData[i]["Offer applicable"],
                                    discount: xlData[i]["Discount applicable"],
                                    stock: "LB" + uniqueCode++,
                                    description: xlData[i]["Description"],
                                    featured: typeof xlData[i]["Featured Product"] != "undefined" &&
                                        xlData[i]["Featured Product"] == "Yes" ?
                                        true :
                                        false,
                                    outOfStock: typeof xlData[i]["Out Of Stock"] != "undefined" &&
                                        xlData[i]["Out Of Stock"] == "Yes" ?
                                        true :
                                        false,
                                    tax: typeof xlData[i]["Tax"] != "undefined" ?
                                        xlData[i]["Tax"] :
                                        0,
                                    image: image,
                                };
                                if (req.body.subcategoryId) {
                                    insertData.subcategoryId = mongoose.mongo.ObjectId(
                                        req.body.subcategoryId
                                    );
                                }
                                if (
                                    xlData[i]["Brand"] &&
                                    typeof xlData[i]["Brand"] != "undefined"
                                ) {
                                    let brandData = await Brand.findOne({
                                        name: xlData[i]["Brand"],
                                    });
                                    if (brandData) {
                                        var brandId = brandData.id;
                                        insertData.brandId = mongoose.mongo.ObjectId(brandData.id);
                                    }
                                }

                                let inventory = [];
                                for (let j = 0; j < storeData.length; j++) {
                                    let store = [];
                                    if (j == 0) {
                                        let varientData = await Varient.aggregate([{
                                                $match: { status: true, deletedAt: 0 },
                                            },
                                            {
                                                $project: {
                                                    varientName: {
                                                        $concat: ["$label", " ", "$measurementUnit"],
                                                    },
                                                },
                                            },
                                        ]);

                                        function search(nameKey, myArray) {
                                            for (let k = 0; k < myArray.length; k++) {
                                                if (myArray[k].varientName === nameKey) {
                                                    return myArray[k]._id;
                                                }
                                            }
                                        }
                                        let varientId = search(xlData[i]["Varient"], varientData);
                                        let storeFieldObj = {
                                            uniqueCode: "LB" + uniqueCode++,
                                            varientId: mongoose.mongo.ObjectID(varientId),
                                            storeId: mongoose.mongo.ObjectID(storeData[j].id),
                                            varient: xlData[i]["Varient"],
                                            price: xlData[i]["Price"],
                                            default: true,
                                        };
                                        store.push(storeFieldObj);
                                    } else {
                                        let storeFieldObj = {
                                            varientId: "",
                                            storeId: mongoose.mongo.ObjectID(storeData[j].id),
                                            varient: "",
                                            price: 0,
                                            default: false,
                                        };
                                        store.push(storeFieldObj);
                                    }
                                    inventory.push(store);
                                }
                                insertData.price = xlData[i]["Price"];
                                insertData.inventory = inventory;
                                let condition = "";
                                if (
                                    xlData[i]["Brand"] &&
                                    typeof xlData[i]["Brand"] != "undefined"
                                ) {
                                    if (brandId) {
                                        condition = {
                                            name: xlData[i]["Product Name"],
                                            brandId: mongoose.mongo.ObjectId(brandId),
                                        };
                                    }
                                }
                                if (condition != "") {
                                    var existsProductData = await Product.findOne(condition);
                                }
                                if (existsProductData) {
                                    let previousInventory = existsProductData.inventory;
                                    insertData.inventory[0][0].default = false;
                                    insertData.inventory[0][0].uniqueCode = "LB" + uniqueCode++;
                                    previousInventory[0].push(insertData.inventory[0][0]);
                                    insertData.inventory = previousInventory;
                                    await Product.updateOne({ _id: mongoose.mongo.ObjectId(existsProductData.id) },
                                        insertData
                                    );
                                } else {
                                    let product = new Product(insertData);
                                    product.save();
                                }
                            }
                        }
                        let moduleName = "Product Management";
                        let pageTitle = "Bulk Upload Product";
                        res.render("admin/product/productlist.ejs", {
                            layout: "admin/layout/layout",
                            pageTitle: pageTitle,
                            moduleName: moduleName,
                            successdata: successdata,
                            errordata: errordata,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    },

    downloadSampleFile: async function(req, res) {
        let brandData = await Brand.find({ status: true, deletedAt: 0 });
        let varientData = await Varient.find({ status: true, deletedAt: 0 });
        let brandArr = [];
        let brand = "";
        for (let i = 0; i < brandData.length; i++) {
            let name = brandData[i].name;
            brand = brand + name + ",";
        }
        brandArr.push('"' + brand + '"');

        let varientArr = [];
        let varient = "";
        for (let i = 0; i < varientData.length; i++) {
            let name = varientData[i].label + " " + varientData[i].measurementUnit;
            varient = varient + name + ",";
        }
        varientArr.push('"' + varient + '"');
        let customData = ["Yes", "No"];
        let booleanArr = [];
        let custom = "";
        for (let i = 0; i < customData.length; i++) {
            let name = customData[i];
            custom = custom + name + ",";
        }
        booleanArr.push('"' + custom + '"');

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Template");
        let firstColumns = [
            { header: "Product Name", key: "name", width: 15 },
            { header: "Brand", key: "brandId", width: 15 },
            { header: "Offer applicable", key: "offer", width: 15 },
            { header: "Discount applicable", key: "discount", width: 15 },
            { header: "Tax", key: "tax", width: 15 },
            { header: "Featured Product", key: "featured", width: 15 },
            { header: "Out Of Stock", key: "outOfStock", width: 15 },
            { header: "Description", key: "description", width: 30 },
            { header: "Varient", key: "varient", width: 15 },
            { header: "Price", key: "price", width: 15 },
        ];
        worksheet.columns = firstColumns;

        let row = worksheet.getRow(1);
        row.eachCell(function(cell, value) {
            if (
                cell == "Tax" ||
                cell == "Featured Product" ||
                cell == "Out Of Stock"
            ) {
                let address = cell._address;
                let color = "FF259C4B";
                worksheet.getCell(address).fill = {
                    type: "pattern",
                    pattern: "darkTrellis",
                    fgColor: { argb: color },
                    bgColor: { argb: color },
                };
            }
            if (
                cell == "Product Name" ||
                cell == "Brand" ||
                cell == "Offer applicable" ||
                cell == "Discount applicable" ||
                cell == "Description" ||
                cell == "Varient" ||
                cell == "Price"
            ) {
                let address = cell._address;
                let color = "FFA71818";
                worksheet.getCell(address).fill = {
                    type: "pattern",
                    pattern: "darkTrellis",
                    fgColor: { argb: color },
                    bgColor: { argb: color },
                };
            }
        });

        for (i = 2; i < 10000; i++) {
            //set brand
            worksheet.getCell("B" + i).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: brandArr,
            };
            //Offer applicable
            worksheet.getCell("C" + i).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: booleanArr,
            };
            //Discount applicable
            worksheet.getCell("D" + i).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: booleanArr,
            };
            //Featured Product
            worksheet.getCell("F" + i).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: booleanArr,
            };
            //Out Of Stock
            worksheet.getCell("G" + i).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: booleanArr,
            };
            //set varient
            worksheet.getCell("I" + i).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: varientArr,
            };
        }
        let random = Math.floor(Math.random() * 100000 + 1);
        let fileName = "sample_" + random + ".xlsx";
        workbook.xlsx
            .writeFile(config.constant.SAMPLECSV + fileName)
            .then(function() {
                let file =
                    config.constant.ABSOLUTEPATH +
                    "/public/uploads/samplecsv/" +
                    fileName;
                res.download(file);
            });
    },
};