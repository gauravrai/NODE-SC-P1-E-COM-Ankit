module.exports = {
	isloggedin: function(req,res,next){
		
		if(!req.session.ADMINID){
			res.redirect('/admin');
		}else{
			next();
		}
	},
	isloggedinadmin: function(req,res,next){		
		if(req.session.ADMINID){
			res.redirect('/admin/dashboard');
		}else{
			next();
		}
	},

	

}