const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Store = model.store;
const State = model.state;
const City = model.city;
const ADMINCALLURL = config.constant.ADMINCALLURL;


module.exports = {
    manageStore: async function(req,res){
		let moduleName = 'Store Management';
		let pageTitle = 'Manage Store';
		var detail = {};	
		detail = {message:req.flash('msg')};
		await config.helpers.permission('manage_store', req, (err,permissionData)=>{
			res.render('admin/store/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, detail:detail, permissionData:permissionData});
		});
	},
	
    listStore:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.name = { $regex: '.*' + searchValue + '.*',$options:'i' };
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Store.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Store.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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
            //console.log(data);
			await config.helpers.permission('manage_store', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
                    var arr1 = [];
                    arr1.push(data[i].name);
                    arr1.push(data[i].uniqueCode);
                    arr1.push(data[i].address);
                    arr1.push(data[i].contactName);
                    arr1.push(data[i].contactNumber);
					await config.helpers.state.getNameById(data[i].stateId, async function (stateName) {
						arr1.push(stateName.name);
					})
					await config.helpers.city.getNameById(data[i].cityId, async function (cityName) {
						arr1.push(cityName.name);
					})
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					if(!data[i].status){
						let change_status = "changeStatus(this,\'1\',\'change_status_store\',\'list_store\',\'store\');";	
						arr1.push('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Inactive</span>');
					}else{
						let change_status = "changeStatus(this,\'0\',\'change_status_store\',\'list_store\',\'store\');";
						arr1.push('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Active</span>');
					}
					let $but_edit = '-';
					if(permissionData.edit=='1'){
					$but_edit = '<span><a href="'+ADMINCALLURL+'/edit_store?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
					}
					let $but_delete = ' - ';
					if(permissionData.delete =='1'){
						let remove = "deleteData(this,\'delete_store\',\'list_store\',\'store\');";
						$but_delete = '&nbsp;&nbsp;<span><a href="javascript:void(0)" class="btn btn-flat btn-info btn-outline-danger" title="Delete" onclick="'+remove+'" id="'+data[i]._id+'"><i class="fas fa fa-trash" ></i></a></span>';
					}
					arr1.push($but_edit+$but_delete);
					arr.push(arr1);
				}
				obj.data = arr;
				res.send(obj);
			});
		});
	},

    addStore: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Store Management';
			let pageTitle = 'Add Store';
			let stateData = await State.find({status: true, deletedAt: 0});	
			function generateCode(){
				let characters = '0123456789';
				let charactersLength = characters.length;
				let uniqueCode = '';
				for (var i = 0; i < 6; i++) {
					uniqueCode += characters.charAt(Math.floor(Math.random() * charactersLength));
				}
				return uniqueCode;
			}
			let uniqueCode = generateCode();
			let storeData = await Store.find();	
			function search(nameKey, myArray){
				for (var i=0; i < myArray.length; i++) {
					if (myArray[i].uniqueCode === nameKey) {
						return true;
					}
				}
			}
			let uniqueCodeFound = search(uniqueCode, storeData);
			if(uniqueCodeFound)
			{
				uniqueCode = generateCode();
			}
			console.log(uniqueCode);
			res.render('admin/store/add.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, stateData:stateData, uniqueCode:uniqueCode } );
		}else{
			let storeData = {
                uniqueCode : req.body.uniqueCode,
                name : req.body.name,
				address : req.body.address,
				stateId : mongoose.mongo.ObjectId(req.body.stateId),
				cityId : mongoose.mongo.ObjectId(req.body.cityId),
				contactName : req.body.contactName,
				contactNumber : req.body.contactNumber
			};
			//console.log(storeData);
			let store = new Store(storeData);
			store.save(function(err, data){
				if(err){console.log(err)}
				req.flash('msg', {msg:'Store has been Created Successfully', status:true});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_store');
				req.flash({});	
			})
		}		
	},
	
    editStore: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Store Management';
			let pageTitle = 'Edit Store';
			let id = req.body.id;
			let storeData = await Store.findOne({_id: mongoose.mongo.ObjectId(id), status: true, deletedAt: 0});	
			let stateData = await State.find({status: true, deletedAt: 0});	
			let cityData = await City.find({stateId: mongoose.mongo.ObjectId(storeData.stateId),status: true, deletedAt: 0});			
			res.render('admin/store/edit',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, stateData:stateData, cityData:cityData, storeData:storeData} );
		}
		if(req.method == "POST"){
			let storeData = {
                uniqueCode : req.body.uniqueCode,
				name : req.body.name,
                address:req.body.address,
				stateId : mongoose.mongo.ObjectId(req.body.stateId),
                cityId : mongoose.mongo.ObjectId(req.body.cityId),
				contactName : req.body.contactName,
				contactNumber : req.body.contactNumber
			};
			await Store.update(
				{ _id: mongoose.mongo.ObjectId(req.body.id) },
				storeData, function(err,data){
					if(err){console.log(err)}
					req.flash('msg', {msg:'Store has been Updated Successfully', status:true});	
					res.redirect(config.constant.ADMINCALLURL+'/manage_store');
					req.flash({});	
			})
		}		
	},
	
    changeStatusStore : function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return Store.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatus(this,\'0\',\'change_status_store\',\'list_store\',\'store\');";
				res.send('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatus(this,\'1\',\'change_status_store\',\'list_store\',\'store\');";	
				res.send('<span class="badge bg-danger"  style="cursor:pointer;" onclick="'+change_status+'">Inactive</span>');
			}
	    })
	},
	
    deleteStore : async function(req,res){
		let id = req.param("id");
		return Store.updateOne({_id:  mongoose.mongo.ObjectId(id)},{deletedAt:2},function(err,data){        	
			if(err) console.error(err);
        	res.send('done');
        })
	},
    
}