const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');
const Area = model.area;
const State = model.state;
const City = model.city;
const Pincode = model.pincode;
const society = model.society;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	manageArea: async function(req,res){
		let moduleName = 'Location Management';
		let pageTitle = 'Manage Area';
		var detail = {};	
		detail = {message:req.flash('msg')};
		let stateData = await State.find({status: true, deletedAt: 0});	
		let cityData = await City.find({status: true, deletedAt: 0});	
		let pincodeData = await Pincode.find({status: true, deletedAt: 0});	
		await config.helpers.permission('manage_area', req, (err,permissionData)=>{
			res.render('admin/area/view.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, detail:detail, permissionData:permissionData, stateData:stateData, cityData:cityData, pincodeData:pincodeData });
		});
	},

	listArea:function(req,res){
		var search = {deletedAt:0}
		let searchValue = req.body.search.value;
		if(searchValue){			
            search.name = { $regex: '.*' + searchValue + '.*',$options:'i' };
		}
		
		let skip = req.input('start') ? parseInt(req.input('start')) : 0;
		let limit= req.input('length') ? parseInt(req.input('length')) : config.constant.LIMIT;
		async.parallel({
		    count:function(callback) {
		        Area.countDocuments(search).sort({'createdAt' : -1}).exec(function(err,data_count){
		        	callback(null,data_count)
		        })
		    },
		    data:function(callback) {		    
		    	Area.find(search).skip(skip).limit(limit).sort({'createdAt' : -1}).exec(function(err,data){
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
			await config.helpers.permission('manage_area', req, async function(err,permissionData) {
				for(i=0;i<data.length;i++){
					var arr1 = [];
					await config.helpers.state.getNameById(data[i].stateId, async function (stateName) {
						arr1.push(stateName.name);
					})
					await config.helpers.city.getNameById(data[i].cityId, async function (cityName) {
						arr1.push(cityName.name);
					})
					await config.helpers.pincode.getNameById(data[i].pincodeId, async function (pincode) {
						arr1.push(pincode.pincode);
					})
					arr1.push(data[i].name);
					arr1.push(moment(data[i].createdAt).format('DD-MM-YYYY'));
					if(!data[i].status){
						let change_status = "changeStatus(this,\'1\',\'change_status_area\',\'list_area\',\'area\');";	
						arr1.push('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Inactive</span>');
					}else{
						let change_status = "changeStatus(this,\'0\',\'change_status_area\',\'list_area\',\'area\');";
						arr1.push('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'" id="'+data[i]._id+'">Active</span>');
					}
					let $but_edit = '-';
					if(permissionData.edit=='1'){
					$but_edit = '<span><a href="'+ADMINCALLURL+'/edit_area?id='+data[i]._id+'" class="btn btn-flat btn-info btn-outline-primary" title="Edit"><i class="fas fa-edit"></i></a></span>';
					}
					let $but_delete = ' - ';
					if(permissionData.delete =='1'){
						let remove = "deleteData(this,\'delete_area\',\'list_area\',\'area\');";
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

	addArea: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Location Management';
			let pageTitle = 'Add Area';
			let stateData = await State.find({status: true, deletedAt: 0});	
			res.render('admin/area/add.ejs',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, stateData:stateData} );
		}else{
			let areaData = {
				name : req.body.name,
				stateId : mongoose.mongo.ObjectId(req.body.stateId),
				cityId : mongoose.mongo.ObjectId(req.body.cityId),
				pincodeId : mongoose.mongo.ObjectId(req.body.pincodeId)
			};
			let area = new Area(areaData);
			area.save(function(err, data){
				if(err){console.log(err)}
				req.flash('msg', {msg:'Area has been Created Successfully', status:true});	
				res.redirect(config.constant.ADMINCALLURL+'/manage_area');
				req.flash({});	
			})
		}		
	},

	editArea: async function(req,res){
		if(req.method == "GET"){
			let moduleName = 'Location Management';
			let pageTitle = 'Edit Area';
			let id = req.body.id;
			let areaData = await Area.findOne({_id: mongoose.mongo.ObjectId(id), deletedAt: 0});		
			let stateData = await State.find({status: true, deletedAt: 0});	
			let cityData = await City.find({stateId: mongoose.mongo.ObjectId(areaData.stateId), status: true, deletedAt: 0});	
			let pincodeData = await Pincode.find({cityId: mongoose.mongo.ObjectId(areaData.cityId), status: true, deletedAt: 0});		
			res.render('admin/area/edit',{layout:'admin/layout/layout', pageTitle:pageTitle, moduleName:moduleName, stateData:stateData, cityData:cityData, pincodeData:pincodeData, areaData:areaData} );
		}
		if(req.method == "POST"){
			let areaData = {
				name : req.body.name,
				stateId : mongoose.mongo.ObjectId(req.body.stateId),
				cityId : mongoose.mongo.ObjectId(req.body.cityId),
				pincodeId : mongoose.mongo.ObjectId(req.body.pincodeId)
			};
			await Area.update(
				{ _id: mongoose.mongo.ObjectId(req.body.id) },
				areaData, function(err,data){
					if(err){console.log(err)}
					req.flash('msg', {msg:'Area has been Updated Successfully', status:true});	
					res.redirect(config.constant.ADMINCALLURL+'/manage_area');
					req.flash({});	
			})
		}		
	},

	deleteArea: async function(req,res){
		let id = req.param("id");
		let societyData = await Society.find({areaId: mongoose.mongo.ObjectId(id)});
		if(societyData.length > 0)
		{
			res.send('There are some active soceity in this area.');
		}
		else
		{
			return Area.updateOne({_id:  mongoose.mongo.ObjectId(id)},{deletedAt:2},function(err,data){        	
				if(err) console.error(err);
				res.send('done');
			})
		}
	},

	changeStatusArea: function(req,res){
		let id = req.param("id");
		let status = req.param("status");
		return Area.updateOne({_id: mongoose.mongo.ObjectId(id)}, {
			status: parseInt(status)?true:false
		},function(err,data){
			if(err) console.error(err);
			if(status == '1'){
				let change_status = "changeStatus(this,\'0\',\'change_status_area\',\'list_area\',\'area\');";
				res.send('<span class="badge bg-success" style="cursor:pointer;" onclick="'+change_status+'">Active</span>');
			}
			else{
				let change_status = "changeStatus(this,\'1\',\'change_status_area\',\'list_area\',\'area\');";	
				res.send('<span class="badge bg-danger" style="cursor:pointer;" onclick="'+change_status+'">Inactive</span>');
			}
	    })
	},
}