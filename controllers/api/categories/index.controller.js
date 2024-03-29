const model = require("../../../models/index.model");
const config = require("../../../config/index");
const Category = model.category;

module.exports = {
    // @route       GET api/v1/category
    // @description Get all categories
    // @access      Public
    categories: async function(req, res) {
        var categoryData = await Category.aggregate([{
                $match: { status: true, deletedAt: 0 },
            },
            {
                $lookup: {
                    from: "sub_categories",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "subcategoryData",
                },
            },
            {
                $addFields: {
                    thumbnailPath: config.constant.CATEGORYTHUMBNAILSHOWPATH,
                    smallPath: config.constant.CATEGORYSMALLSHOWPATH,
                    largePath: config.constant.CATEGORYLARGESHOWPATH,
                },
            },
            {
                $project: {
                    __v: 0,
                    createdAt: 0,
                    updatedAt: 0,
                },
            },
        ]).sort({ name: 1 });
        if (categoryData.length > 0) {
            let data = [];
            for (let i = 0; i < categoryData.length; i++) {
                data[i] = categoryData[i];
                if (categoryData[i].subcategoryData.length > 0) {
                    data[i].subcategoryData = true;
                } else {
                    data[i].subcategoryData = false;
                }
            }
            return res.status(200).json({
                data: categoryData,
                status: "success",
                message: "Data fetched successfully!!",
                code: 200,
            });
        } else {
            return res.status(200).json({
                data: categoryData,
                status: "success",
                message: "Data No Found!!",
                code: 200,
            });
        }
    },

    // @route       GET api/v1/category and sub category
    // @description Get all categories nd sub category
    // @access      Public
    getCategoriesSubcategory: async function(req, res) {
        var categorySubcategoryData = [];
        var categorySubcategoryData = await Category.aggregate([{
                $lookup: {
                    from: "sub_categories",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "subcategory",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    "subcategory._id": 1,
                    "subcategory.name": 1,
                    "subcategory.slug": 1,
                    "subcategory.categoryId": 1,
                },
            },
            {
                $match: { status: true, deletedAt: 0 },
            },
        ]);
        //console.log(categorySubcategoryData);
        if (categorySubcategoryData.length > 0) {
            return res.status(200).json({
                data: categorySubcategoryData,
                status: "success",
                message: "Data fetched successfully!!",
                code: 200,
            });
        } else {
            return res.status(200).json({
                data: categorySubcategoryData,
                status: "success",
                message: "Data fetched successfully!!",
                code: 200,
            });
        }
    },
};