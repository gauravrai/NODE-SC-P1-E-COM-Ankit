const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const moment = require('moment');
const Contact = model.contact;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {

    manageContact: async function(req,res){
		let moduleName = 'Contact Management';
		let pageTitle = 'Manage Contact';
		await config.helpers.permission('manage_contact', req, (err,permissionData)=>{
			res.render('admin/contact/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, permissionData:permissionData});
		});
	},
	
	listContact:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.$or = [
				{ name: { $regex: '.*' + searchValue + '.*',$options:'i' } },
				{ email: { $regex: '.*' + searchValue + '.*',$options:'i' } },
				{ mobile: { $regex: '.*' + searchValue + '.*',$options:'i' } },
			];
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Contact.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Contact.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
		        	callback(null,data)
		        })		        
		    }
		},		
		async function(err, results) {
		   	var obj = {};
			obj.draw = req.body.draw;
			obj.recordsTotal = results.count?results.count:0;
			obj.recordsFiltered =results.count?results.count:0;
			var data = results.data?results.data:[];
			var arr =[];
            var perdata = {add:1,edit:1,delete:1}
			await config.helpers.permission('manage_contact', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
					var arr1 = [];
                    arr1.push(data[i].name);
                    arr1.push(data[i].email);
                    arr1.push(data[i].mobile);
                    arr1.push(data[i].message);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
                    if(!data[i].readStatus){	
						arr1.push('<span class="badge bg-danger" style="cursor:pointer;">Unread</span>');
					}else{
						arr1.push('<span class="badge bg-success" style="cursor:pointer;">Read</span>');
					}
					arr.push(arr1);
				}
				obj.data = arr;
				res.send(obj);
			});
		});
	},
}