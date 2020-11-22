
const dotenv = require('dotenv').config();
var SITEURL = process.env.SITEURL+":"+process.env.PORT+'/';
var ABSOLUTEPATH = process.env.ABSOLUTEPATH;
var basic_path='C:/Users/sonali/Desktop/softchilli/backend/';
module.exports = {
	
	SITEURL : SITEURL,
	SITENAME : "Local Baniyaa",
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

	OFFERBANNERUPLOADPATH: './public/uploads/offerbanner/',
	OFFERBANNERSHOWPATH: SITEURL+'uploads/offerbanner/',	

	ORDER_STATUS: [ 'NEW', 'IN_PROCESS', 'IN_TRANSIT', 'DELIVERED', 'CANCELED'],
	MESSAGE_SLUG: [ 'NEW-ORDER', 'IN-PROCESS-ORDER', 'IN-TRANSIT-ORDER', 'DELIVERED-ORDER', 'CANCELED-ORDER'],
	PAYMENT_STATUS: [ 'PENDING', 'FAILED', 'COMPLETED'],
	TIME_SLOT: [ '8:00AM - 12:00PM', '12:00PM - 04:00PM', '04:00PM - 08:00PM'],
	DEFAULTTIMESLOT: '8:00AM - 12:00PM',	 
	
	SMS_API_USERNAME: 'evamastuT',
	SMS_API_KEY: 'F46C7-CF479',
	SMS_API_SID: 'EVMSTU',

	RAZORPAY_KEY_ID: 'rzp_test_0kyyIasnFgb31Z',
	RAZORPAY_KEY_SECRET: 'B1CSi3hSUNmIJCt1Tqp5UzPX',
}
