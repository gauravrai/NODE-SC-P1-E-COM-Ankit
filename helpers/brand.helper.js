const model = require("../models/index.model");
const config = require("../config/index");
const mongoose = require("mongoose");
const async = require("async");
var Brand = model.brand;

module.exports = {
    getNameById: async function(brandId, cb) {
        if (brandId && typeof brandId != "undefined") {
            let data = await Brand.findOne({ _id: mongoose.mongo.ObjectId(brandId) }, { name: 1, _id: 0 });
            if (data) cb(data);
            else cb("");
        } else {
            cb("");
        }
    },
};