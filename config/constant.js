var SITEURL = process.env.SITEURL+":"+process.env.PORT+'/';
var ABSOLUTEPATH = process.env.ABSOLUTEPATH;
var basic_path='C:/Users/sonali/Desktop/softchilli/backend/'
module.exports = {
	
	SITEURL : SITEURL,
	SITENAME : "Softchilli",
	ADMINSITEURL:SITEURL+'admin/',
	ADMINCALLURL:'/admin',
	APIURL:'/api',
	TIMEZONE:process.env.TIMEZONE,
	FORMATETIME:'DD-MM-YYYY hh:mm A',
  	COMPANYLOGO:SITEURL+"", 
	LIMIT: 10
}
