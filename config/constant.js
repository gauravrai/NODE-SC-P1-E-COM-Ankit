var SITEURL = process.env.SITEURL+":"+process.env.PORT+'/';
var ABSOLUTEPATH = process.env.ABSOLUTEPATH;
var basic_path='C:/Users/sonali/Desktop/softchilli/backend/'
module.exports = {
	
	SITEURL : SITEURL,
	SITENAME : "LocalBaniya",
	ADMINSITEURL:SITEURL+'admin/',
	ADMINCALLURL:'/admin',
	APIURL:'/api/v1',
	TIMEZONE:process.env.TIMEZONE,
	FORMATETIME:'DD-MM-YYYY hh:mm A',
	COMPANYLOGO:SITEURL+"", 
	JWT_SECRET :"local_BnaiyaSecret",
	  
	PAGENO: 1,	  
	LIMIT: 10,	  
	PRODUCTIMAGELENGTH: 2,	  
	PRODUCTTHUMBNAILUPLOADPATH: './public/uploads/product/thumbnail/',	  
	PRODUCTSMALLUPLOADPATH:  './public/uploads/product/small/', 
	PRODUCTLARGEUPLOADPATH:  './public/uploads/product/large/',
	PRODUCTTHUMBNAILSHOWPATH: SITEURL+'uploads/product/thumbnail/',	  
	PRODUCTSMALLSHOWPATH:  SITEURL+'uploads/product/small/', 
	PRODUCTLARGESHOWPATH:  SITEURL+'uploads/product/large/',

	CATEGORYTHUMBNAILUPLOADPATH: './public/uploads/category/thumbnail/',	  
	CATEGORYSMALLUPLOADPATH:  './public/uploads/category/small/', 
	CATEGORYLARGEUPLOADPATH:  './public/uploads/category/large/',
	CATEGORYTHUMBNAILSHOWPATH: SITEURL+'uploads/category/thumbnail/',	  
	CATEGORYSMALLSHOWPATH:  SITEURL+'uploads/category/small/', 
	CATEGORYLARGESHOWPATH:  SITEURL+'uploads/category/large/',

	SUBCATEGORYTHUMBNAILUPLOADPATH: './public/uploads/subcategory/thumbnail/',	  
	SUBCATEGORYSMALLUPLOADPATH:  './public/uploads/subcategory/small/', 
	SUBCATEGORYLARGEUPLOADPATH:  './public/uploads/subcategory/large/',
	SUBCATEGORYTHUMBNAILSHOWPATH: SITEURL+'uploads/subcategory/thumbnail/',	  
	SUBCATEGORYSMALLSHOWPATH:  SITEURL+'uploads/subcategory/small/', 
	SUBCATEGORYLARGESHOWPATH:  SITEURL+'uploads/subcategory/large/',

	ORDER_STATUS: [ 'NEW', 'IN_PROCESS', 'IN_TRANSIT', 'DELIVERED', 'CANCELED'],
	paymentStatus: [ 'PENDING', 'FAILED', 'COMPLETED']
}
