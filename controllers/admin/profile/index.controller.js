const model = require("../../../models/index.model");
const config = require("../../../config/index");
const db = config.connection;
const async = require("async");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const moment = require("moment");
const Profile = model.profile;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
    manageProfile: async function(req, res) {
        let moduleName = "Profile Management";
        let pageTitle = "Manage Profile";
        var detail = {};
        detail = { message: req.flash("msg") };
        await config.helpers.permission(
            "manage_profile",
            req,
            (err, permissionData) => {
                res.render("admin/profile/view.ejs", {
                    layout: "admin/layout/layout",
                    pageTitle: pageTitle,
                    moduleName: moduleName,
                    detail: detail,
                    permissionData: permissionData,
                });
            }
        );
    },
    listProfile: function(req, res) {
        var search = { deletedAt: 0 };
        let searchValue = req.body.search.value;
        if (searchValue) {
            search.$or = [
                { name: { $regex: ".*" + searchValue + ".*", $options: "i" } },
                { slug: { $regex: ".*" + searchValue + ".*", $options: "i" } },
            ];
        }

        let skip = req.input("start") ? parseInt(req.input("start")) : 0;
        let limit = req.input("length") ?
            parseInt(req.input("length")) :
            config.constant.LIMIT;
        async.parallel({
                count: function(callback) {
                    Profile.countDocuments(search)
                        .sort({ createdAt: -1 })
                        .exec(function(err, data_count) {
                            callback(null, data_count);
                        });
                },
                data: function(callback) {
                    Profile.find(search)
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
                    "manage_profile",
                    req,
                    async function(err, permissionData) {
                        for (i = 0; i < data.length; i++) {
                            var arr1 = [];
                            let src =
                                config.constant.PROFILETHUMBNAILSHOWPATH +
                                data[i].image.thumbnail;
                            arr1.push('<img src="' + src + '" width="50px" height="50px">');
                            arr1.push(data[i].name);
                            arr1.push(data[i].slug);
                            arr1.push(moment(data[i].createdAt).format("DD-MM-YYYY"));
                            if (!data[i].status) {
                                let change_status =
                                    "changeStatus(this,'1','change_status_profile','list_profile','profile');";
                                arr1.push(
                                    '<span class="badge bg-danger" style="cursor:pointer;" onclick="' +
                                    change_status +
                                    '" id="' +
                                    data[i]._id +
                                    '">Inactive</span>'
                                );
                            } else {
                                let change_status =
                                    "changeStatus(this,'0','change_status_profile','list_profile','profile');";
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
                                    "/edit_profile?id=" +
                                    data[i]._id +
                                    '" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
                            }
                            let $but_delete = " - ";
                            if (permissionData.delete == "1") {
                                let remove =
                                    "deleteData(this,'delete_profile','list_profile','profile');";
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
    addProfile: async function(req, res) {
        if (req.method == "GET") {
            let moduleName = "Profile Management";
            let pageTitle = "Add Profile";
            res.render("admin/profile/add.ejs", {
                layout: "admin/layout/layout",
                pageTitle: pageTitle,
                moduleName: moduleName,
            });
        } else {
            let profileData = {
                name: req.body.name,
                slug: req.body.slug,
                order: req.body.order,
            };
            let image = {};
            new Promise(function(resolve, reject) {
                    let thumbnailPath = config.constant.PROFILETHUMBNAILUPLOADPATH;
                    let thumbnailName = Date.now() + "_" + req.files.thumbnail.name;
                    image.thumbnail = thumbnailName;
                    req.files.thumbnail.mv(
                        thumbnailPath + thumbnailName,
                        function(err, data) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    );
                })
                .then(async() => {
                    new Promise(function(resolve1, reject1) {
                        let smallPath = config.constant.PROFILESMALLUPLOADPATH;
                        let smallName = Date.now() + "_" + req.files.small.name;
                        image.small = smallName;
                        req.files.small.mv(smallPath + smallName, function(err, data) {
                            if (err) {
                                console.log(err);
                                reject1(err);
                            } else {
                                resolve1();
                            }
                        });
                    }).then(async() => {
                        new Promise(function(resolve2, reject2) {
                            let largePath = config.constant.PROFILELARGEUPLOADPATH;
                            let largeName = Date.now() + "_" + req.files.large.name;
                            image.large = largeName;
                            req.files.large.mv(largePath + largeName, function(err, data) {
                                if (err) {
                                    console.log(err);
                                    reject2(err);
                                } else {
                                    resolve2();
                                }
                            });
                        }).then(async() => {
                            profileData.image = image;
                            console.log(profileData);
                            let profileobj = new Profile(profileData);
                            profileobj.save(function(err, data) {
                                if (err) {
                                    console.log(err);
                                }
                                req.flash("msg", {
                                    msg: "Profile has been Created Successfully",
                                    status: true,
                                });
                                res.redirect(config.constant.ADMINCALLURL + "/manage_profile");
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

    editProfile: async function(req, res) {
        if (req.method == "GET") {
            let moduleName = "Profile Management";
            let pageTitle = "Edit Profile";
            let id = req.body.id;
            let profileData = await Profile.findOne({
                _id: mongoose.mongo.ObjectId(id),
                deletedAt: 0,
            });
            res.render("admin/profile/edit", {
                layout: "admin/layout/layout",
                pageTitle: pageTitle,
                moduleName: moduleName,
                profileData: profileData,
            });
        }
        if (req.method == "POST") {
            let profileData = {
                name: req.body.name,
                slug: req.body.slug,
                order: req.body.order,
            };
            if (Object.keys(req.files).length !== 0) {
                let image = {};
                new Promise(function(resolve, reject) {
                        if (typeof req.files.thumbnail != "undefined") {
                            let thumbnailPath = config.constant.PROFILETHUMBNAILUPLOADPATH;
                            let thumbnailName = Date.now() + "_" + req.files.thumbnail.name;
                            image.thumbnail = thumbnailName;
                            req.files.thumbnail.mv(
                                thumbnailPath + thumbnailName,
                                function(err, data) {
                                    if (err) {
                                        console.log(err);
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                }
                            );
                        } else {
                            image.thumbnail = req.body.thumbnailhidden;
                        }
                    })
                    .then(async() => {
                        new Promise(function(resolve1, reject1) {
                            if (typeof req.files.small != "undefined") {
                                let smallPath = config.constant.PROFILESMALLUPLOADPATH;
                                let smallName = Date.now() + "_" + req.files.small.name;
                                image.small = smallName;
                                req.files.small.mv(smallPath + smallName, function(err, data) {
                                    if (err) {
                                        console.log(err);
                                        reject1(err);
                                    } else {
                                        resolve1();
                                    }
                                });
                            } else {
                                image.small = req.body.smallhidden;
                            }
                        }).then(async() => {
                            new Promise(function(resolve2, reject2) {
                                if (typeof req.files.large != "undefined") {
                                    let largePath = config.constant.PROFILELARGEUPLOADPATH;
                                    let largeName = Date.now() + "_" + req.files.large.name;
                                    image.large = largeName;
                                    req.files.large.mv(
                                        largePath + largeName,
                                        function(err, data) {
                                            if (err) {
                                                console.log(err);
                                                reject2(err);
                                            } else {
                                                resolve2();
                                            }
                                        }
                                    );
                                } else {
                                    image.large = req.body.largehidden;
                                }
                            }).then(async() => {
                                let data = {
                                    image: image,
                                };
                                await Profile.updateOne({ _id: mongoose.mongo.ObjectId(req.body.id) },
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
            await Profile.update({ _id: mongoose.mongo.ObjectId(req.body.id) },
                profileData,
                function(err, data) {
                    if (err) {
                        console.log(err);
                    }
                    req.flash("msg", {
                        msg: "Profile has been Updated Successfully",
                        status: true,
                    });
                    res.redirect(config.constant.ADMINCALLURL + "/manage_profile");
                    req.flash({});
                }
            );
        }
    },

    deleteProfile: async function(req, res) {
        let id = req.param("id");

        return Profile.updateOne({ _id: mongoose.mongo.ObjectId(id) }, { deletedAt: 2 },
            function(err, data) {
                if (err) console.error(err);
                res.send("done");
            }
        );
    },

    changeStatusProfile: function(req, res) {
        let id = req.param("id");
        let status = req.param("status");
        return Profile.updateOne({ _id: mongoose.mongo.ObjectId(id) }, {
                status: parseInt(status) ? true : false,
            },
            function(err, data) {
                if (err) console.error(err);
                if (status == "1") {
                    let change_status =
                        "changeStatus(this,'0','change_status_profile','list_profile','profile');";
                    res.send(
                        '<span class="badge bg-success" style="cursor:pointer;" onclick="' +
                        change_status +
                        '">Active</span>'
                    );
                } else {
                    let change_status =
                        "changeStatus(this,'1','change_status_profile','list_profile','profile');";
                    res.send(
                        '<span class="badge bg-danger" style="cursor:pointer;" onclick="' +
                        change_status +
                        '">Inactive</span>'
                    );
                }
            }
        );
    },

    checkSlugProfile: function(req, res) {
        var slug = req.body.slug;
        var id = req.body.id;
        var search = { deletedAt: 0, slug: slug };
        if (id) {
            search._id = { $ne: id };
        }
        Profile.find(search).exec(function(err, profileData) {
            if (profileData.length > 0) {
                res.send("OK");
            } else {
                res.send();
            }
        });
    },
};