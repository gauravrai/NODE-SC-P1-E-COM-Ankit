const model  = require('../../models/index.model');
const config = require('../../config/index');
const bcrypt = require("bcrypt-nodejs");
const Admin = model.admin;
const ADMINCALLURL = config.constant.ADMINCALLURL;

module.exports = {
	index: async function(req,res){
		var detail = {};
		if(req.method == "GET"){	
			let pageTitle = 'Login';		
			detail = {message:req.flash('msg')};			
			res.render('admin/login.ejs',{layout:'admin/layout/layout_login', pageTitle:pageTitle, detail:detail} );
		}else{
			let username = req.body.username;
			let password = req.body.password;
			let adminData = await Admin.findOne({username:username});
			if(adminData){
				if(bcrypt.compareSync(password, adminData.password)){
					req.session.ADMINID = adminData._id;
					req.session.ADMINNAME = adminData.name;
					if(req.input('remember_me') == '1')
					{
						res.cookie('username',req.input("username"),{maxAge : new Date(Date.now() + 12096000)});
						res.cookie('password',req.input("password"),{maxAge : new Date(Date.now() + 12096000)});
						
						}else
						{
						res.clearCookie('username');
						res.clearCookie('password');
						}
					detail.status = true;
					res.redirect(ADMINCALLURL+'/dashboard');
				}else{
					req.flash('msg', {msg:'Please Enter valid password',status:false});						
					res.redirect(ADMINCALLURL,);
				}
			}else{
				req.flash('msg', {msg:'Please Enter valid username',status:false});
				res.redirect(ADMINCALLURL);
			}		
		}	
	},
	logout :function(req,res){
		req.session.destroy(function(err){
     		if(err) console.log(err);
			res.redirect(ADMINCALLURL);
		});
	},

	create:function(req,res){
		
		var Admin = new admin({
			username:"masteradmin",
			password:bcrypt.hashSync("12345678"),
		})
		Admin.save()
		.then(data => {
			res.send(data);
		}).catch(err => {
			res.send('error occured',err);
		});
	},	
}