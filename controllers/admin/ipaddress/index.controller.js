const model = require("../../../models/index.model");
const config = require("../../../config/index");
const db = config.connection;
const async = require("async");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const moment = require("moment");
const Brand = model.brand;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
    manageSubCategory: async function(req, res) {
        let moduleName = "IP Address Management";
        let pageTitle = "Manage IP Address";
        var detail = {};
        detail = { message: req.flash("msg") };
        await config.helpers.permission(
            "manage_ipaddress",
            req,
            (err, permissionData) => {
                res.render("admin/ipaddress/view.ejs", {
                    layout: "admin/layout/layout",
                    pageTitle: pageTitle,
                    moduleName: moduleName,
                    detail: detail,
                    permissionData: permissionData,
                });
            }
        );
    },

    listSubCategory: function(req, res) {
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
                    SubCategory.countDocuments(search)
                        .sort({ createdAt: -1 })
                        .exec(function(err, data_count) {
                            callback(null, data_count);
                        });
                },
                data: function(callback) {
                    SubCategory.find(search)
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
                //console.log(data); return false;
                var arr = [];
                var perdata = { add: 1, edit: 1, delete: 1 };
                //console.log(data);
                await config.helpers.permission(
                    "manage_ipaddress",
                    req,
                    async function(err, permissionData) {
                        for (i = 0; i < data.length; i++) {
                            var arr1 = [];
                            let src =
                                config.constant.SUBCATEGORYTHUMBNAILSHOWPATH +
                                data[i].image.thumbnail;
                            arr1.push('<img src="' + src + '" width="50px" height="50px">');
                            arr1.push(data[i].name);
                            await config.helpers.category.getNameById(
                                data[i].categoryId,
                                async function(categoryName) {
                                    var cat_name = categoryName ? categoryName.name : "N/A";
                                    //console.log(categoryName.name);return false;
                                    //arr1.push(categoryName.name);
                                    arr1.push(cat_name);
                                }
                            );
                            arr1.push(data[i].slug);
                            arr1.push(moment(data[i].createdAt).format("DD-MM-YYYY"));
                            if (!data[i].status) {
                                let change_status =
                                    "changeStatus(this,'1','change_status_subcategory','list_subcategory','subcategory');";
                                arr1.push(
                                    '<span class="badge bg-danger" style="cursor:pointer;" onclick="' +
                                    change_status +
                                    '" id="' +
                                    data[i]._id +
                                    '">Inactive</span>'
                                );
                            } else {
                                let change_status =
                                    "changeStatus(this,'0','change_status_subcategory','list_subcategory','subcategory');";
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
                                    "/edit_subcategory?id=" +
                                    data[i]._id +
                                    '" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
                            }
                            let $but_delete = " - ";
                            if (permissionData.delete == "1") {
                                let remove =
                                    "deleteData(this,'delete_subcategory','list_subcategory','subcategory');";
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
                        //console.log(arr);
                        obj.data = arr;
                        res.send(obj);
                    }
                );
            }
        );
    },
};