const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const Product     = model.product;
const THUMNAILPATH = config.constant.THUMBNAILUPLOADPATH;
const SMALLPATH = config.constant.SMALLUPLOADPATH;
const LARGEPATH = config.constant.LARGEUPLOADPATH;

module.exports = {
	
    // @route       GET api/v1/product
    // @description Get all product
    // @access      Public
	productList:async function(req,res){
        var productData = [];
        //var productData = await Product.find({status:true, deletedAt: 0},{}).sort( { name : 1} );
        var productData = await Product.aggregate([ 
            {
                $addFields: {
                    "thumbnail" :THUMNAILPATH,
                    "small" : SMALLPATH,
                    "large" : LARGEPATH
                }
            },
            {
                $project: { 
                    createdAt:0,
                    updatedAt:0
                }
            },
            {
                $match : {status:true, deletedAt: 0}
            }
            
        ]).sort( { name : 1} );

        if(productData.length>0) {
            return res.status(200).json({ data: productData, status: 'success', message: "Data fetched successfully!!" });
        } else {
            return res.status(200).json({ data: productData, status: 'success', message: "Data No Found!!" });
        }
        
		
    },
    productListByCatId:async function(req,res){
        var productData = [];
        var catId =  req.body.cat_id;
        var productData = await Product.find({cate_id:catId,status:true, deletedAt: 0},{}).sort( { name : 1} );
        if(productData.length>0) {
            return res.status(200).json({ data: productData, status: 'success', message: "Data fetched successfully!!" });
        } else {
            return res.status(200).json({ data: productData, status: 'success', message: "Data No Found!!" });
        }
        
    },
    productListBySubCatId: async function(req,res){
        var productData = [];
        var subcatId =  req.body.sub_catid;
        var productData = await Product.find({s_cate_id:subcatId,status:true, deletedAt: 0},{}).sort( { name : 1} );
        if(productData.length>0) {
            return res.status(200).json({ data: productData, status: 'success', message: "Data fetched successfully!!" });
        } else {
            return res.status(200).json({ data: productData, status: 'success', message: "Data No Found!!" });
        }
        
    },
    searchProduct : async function(req,res){
        var   productName  = req.body.productName;
        if (productName ==null || productName == '')
        {
            return res.status(400).json({ message: "Product Name is Not Empty" });
        }
        var productData = await Product.find({name:new RegExp(productName, 'i'),status:true, deletedAt: 0},{}).sort( { name : 1} );
        if(productData.length>0) {
            return res.status(200).json({ data: productData, status: 'success', message: "Data fetched successfully!!" });
        } else {
            return res.status(200).json({ data: productData, status: 'success', message: "Data No Found!!" });
        }
    }
    
    

	
}