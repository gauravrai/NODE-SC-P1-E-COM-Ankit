const model = require("../../../models/index.model");
const config = require("../../../config/index");
const db = config.connection;
const async = require("async");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const moment = require("moment");
const Brand = model.brand;
const ADMINCALLURL = config.constant.ADMINCALLURL;
const IpAddress = model.ip_address;

module.exports = {
    manageIpAddress: async function(req, res) {
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
    listIpAddress: function(req, res) {
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
                    IpAddress.countDocuments(search)
                        .sort({ createdAt: -1 })
                        .exec(function(err, data_count) {
                            callback(null, data_count);
                        });
                },
                data: function(callback) {
                    IpAddress.find(search)
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
                            arr1.push(i + 1);
                            arr1.push(data[i].ipAddress);
                            await config.helpers.brand.getNameById(
                                data[i].brandId,
                                async function(brandName) {
                                    var brand_name = brandName ? brandName.name : "N/A";
                                    arr1.push(brand_name);
                                }
                            );
                            arr1.push(moment(data[i].createdAt).format("DD-MM-YYYY"));
                            if (!data[i].status) {
                                let change_status =
                                    "changeStatus(this,'1','change_status_ipaddress','list_ipaddress','ipAddress');";
                                arr1.push(
                                    '<span class="badge bg-danger" style="cursor:pointer;" onclick="' +
                                    change_status +
                                    '" id="' +
                                    data[i]._id +
                                    '">Inactive</span>'
                                );
                            } else {
                                let change_status =
                                    "changeStatus(this,'0','change_status_ipaddress','list_ipaddress','ipAddress');";
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
                                    "/edit_ipaddress?id=" +
                                    data[i]._id +
                                    '" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
                            }
                            let $but_delete = " - ";
                            if (permissionData.delete == "1") {
                                let remove =
                                    "deleteData(this,'delete_ipaddress','list_ipaddress','ipAddress');";
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
    addIpAddress: async function(req, res) {
        if (req.method == "GET") {
            let moduleName = "IP Address Management";
            let pageTitle = "Add IP Address";
            let brandData = await Brand.find({ status: true, deletedAt: 0 });
            res.render("admin/ipaddress/add.ejs", {
                layout: "admin/layout/layout",
                pageTitle: pageTitle,
                moduleName: moduleName,
                brandData: brandData,
            });
        } else {
            let ipAddressData = {
                ipAddress: req.body.ip_address,
                brandId: req.body.brandId,
                order: req.body.order,
            };
            let ipAddress = new IpAddress(ipAddressData);
            ipAddress.save(function(err, data) {
                if (err) {
                    console.log(err);
                }
                req.flash("msg", {
                    msg: "IP Address has been Added Successfully",
                    status: true,
                });
                res.redirect(config.constant.ADMINCALLURL + "/manage_ipaddress");
                req.flash({});
            });
        }
    },
    editIpAddress: async function(req, res) {
        if (req.method == "GET") {
            let moduleName = "IP Address Management";
            let pageTitle = "Edit IP Address";
            let id = req.body.id;
            let ipAddressData = await IpAddress.findOne({
                _id: mongoose.mongo.ObjectId(id),
                deletedAt: 0,
            });
            let brandData = await Brand.find({
                status: true,
                deletedAt: 0,
            });
            res.render("admin/ipaddress/edit", {
                layout: "admin/layout/layout",
                pageTitle: pageTitle,
                moduleName: moduleName,
                ipAddressData: ipAddressData,
                brandData: brandData,
            });
        }
        if (req.method == "POST") {
            let ipAddressData = {
                ipAddress: req.body.ip_address,
                brandId: req.body.brandId,
                order: req.body.order,
            };
            await IpAddress.update({ _id: mongoose.mongo.ObjectId(req.body.id) },
                ipAddressData,
                function(err, data) {
                    if (err) {
                        console.log(err);
                    }
                    req.flash("msg", {
                        msg: "IP Address has been Updated Successfully",
                        status: true,
                    });
                    res.redirect(config.constant.ADMINCALLURL + "/manage_ipaddress");
                    req.flash({});
                }
            );
        }
    },
    deleteIpAddress: async function(req, res) {
        let id = req.param("id");
        if (id == "") {
            res.send("There are some issue in this ip address.");
        } else {
            return IpAddress.updateOne({ _id: mongoose.mongo.ObjectId(id) }, { deletedAt: 2 },
                function(err, data) {
                    if (err) console.error(err);
                    res.send("done");
                }
            );
        }
    },
    changeStatusIpAddress: function(req, res) {
        let id = req.param("id");
        let status = req.param("status");
        return IpAddress.updateOne({ _id: mongoose.mongo.ObjectId(id) }, {
                status: parseInt(status) ? true : false,
            },
            function(err, data) {
                if (err) console.error(err);
                if (status == "1") {
                    let change_status =
                        "changeStatus(this,'0','change_status_ipaddress','list_ipaddress','ipAddress');";
                    res.send(
                        '<span class="badge bg-success" style="cursor:pointer;" onclick="' +
                        change_status +
                        '">Active</span>'
                    );
                } else {
                    let change_status =
                        "changeStatus(this,'1','change_status_ipaddress','list_ipaddress','ipAddress');";
                    res.send(
                        '<span class="badge bg-danger" style="cursor:pointer;" onclick="' +
                        change_status +
                        '">Inactive</span>'
                    );
                }
            }
        );
    },
};