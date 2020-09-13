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
	JWT_Token :"secret",
	  
	LIMIT: 10,	  
	PRODUCTIMAGELENGTH: 2,	  
	THUMBNAILUPLOADPATH: './public/uploads/product/thumbnail/',	  
	SMALLUPLOADPATH:  './public/uploads/product/small/', 
	LARGEUPLOADPATH:  './public/uploads/product/large/',
}
