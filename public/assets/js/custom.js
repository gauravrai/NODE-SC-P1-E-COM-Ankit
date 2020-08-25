$(document).ready(function() {
	get_allmenu();
});
function get_allmenu(){
	$.ajax({
		type: 'POST',
		url: "allmenu",
		data: {},
		success: function(response) {
			$("#allMenu").html(response);
			menu_active();
		}
	});
}

function menu_active()
{
    let url = window.location.pathname.split( '/' );
   	length = url.length;
	let path = url[2];
	let link = '';
	if(path == 'dashboard')
	{
		$('.side-menu li:first a').addClass("active");
	}
	else 
	{
		$(".side-menu > li ").find("ul li").each(function() {
			link = $(this).find("a").attr("href");
			let lastPartOfLink = link.substr(link.lastIndexOf("/")+1,link.length);
			if(lastPartOfLink == path)
			{
				$(this).find('a').addClass("active");
				$(this).parent().siblings('a').addClass("active");
				$(this).parent().parent().addClass("menu-open");
			}
		});
	}
}
		
function checkAllmenu(menuid){
	if($('#'+menuid).is(':checked')){
		$('.'+menuid).prop('checked', true);
	}
	else{
		$('.'+menuid).prop('checked', false);
	}
}

function checkAllsubmenu(menuid){
	let array = menuid.split("_");
	let menu_id_val = $("#"+menuid).val();
	if($('#'+menuid).is(':checked')){
		$('.'+menuid).prop('checked', true);
		$('.submenu_'+menu_id_val).prop('checked', true);
	}
	else{
		$('.'+menuid).prop('checked', false);
		$('.submenu_'+menu_id_val).prop('checked', false);
	}
	let len = $('.menu_'+array[2]+':checked').length;
	if(len >0){
		$('#menu_'+array[2]).prop('checked', true);
	}
	else{
		$('#menu_'+array[2]).prop('checked', false);
	}
}

function checksubmenuPermission(menuid){
	var array = menuid.split("_");
	var idmenu = array[2];
	var idsubmenu = array[1];

	//menu
	var lensubmenu = $('.submenu_'+idsubmenu+':checked').length;
	if(lensubmenu>0){
		$('#submenu_'+idsubmenu+"_"+idmenu).prop('checked', true);
	}
	else{
		$('#submenu_'+idsubmenu+"_"+idmenu).prop('checked', false);
	}

	//submenu
	var lenmenu = $('.menu_'+idmenu+':checked').length;
	if(lenmenu>0){
		$('#menu_'+idmenu).prop('checked', true);
	}
	else{
		$('#menu_'+idmenu).prop('checked', false);
	}

}

//Delete data function
function getLocationFields(id, name, controller, label, functionName){
    $.ajax({
		type: 'POST',
		url: controller+'/'+id,
		data: {name: name, label: label, functionName:functionName},
		success: function(response) {
			console.log(response);
			if(response){
				$('#'+name+'Data').html(response);	
			}
			else{
				$('#'+name+'Data').html('');	
			}
		}
	});
}




//Delete data function
function getLocationFieldsMulti(id, name, controller, label, functionName){
	
    $.ajax({
		type: 'POST',
		url: controller+'/'+id,
		data: {name: name, label: label, functionName:functionName},
		success: function(response) {
			console.log(response);
			if(response){
				$('#'+name+'Data').html(response);	
			}
			else{
				$('#'+name+'Data').html('');	
			}
		}
	});
}

$('body').on('click', '.nav-sidebar .has-treeview', function() {
	if($(this).hasClass('menu-open') == false){
		$(this).addClass('menu-open');
		$(this > ul).slideDown();
	}else
	{
		$(this).removeClass('menu-open');
		$(this > ul).sldeUp();
	}
});

$("#searchHead").click(function(){
	$("#searchBox").slideToggle("slow");
	// var class_data = $("#global_search").attr('class');

	// if(class_data=="srch-icn ti-search")
	// {
	//   $("#global_search").removeClass("ti-search");
	//   $("#global_search").addClass("ti-close");
	// }
	// if(class_data=="srch-icn ti-close")
	// {
	//   $("#global_search").removeClass("ti-close");
	//   $("#global_search").addClass("ti-search");
	// }

});