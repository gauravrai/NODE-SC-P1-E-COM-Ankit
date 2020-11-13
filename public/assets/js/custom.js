$('.select2').select2({
	placeholder : "Select Option"
});
function initailizeSelect2(){
  $('.select2').select2({
	placeholder : "Select Option"
  });
}

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

function checkSlug(controller, checkType,user_id)
{
    var name=$('#name').val();
    if(checkType=='checkFromName')
    {
        name=name.trim();
		name=name.toLowerCase();
        name=name.replace(/[^a-zA-Z ]/g,"");
        name=name.replace(/ /g,"-");
        $('#slug').val(name);
    }
    var slug=$('#slug').val();
    if(checkType=='checkFromSlug')
    {
		slug=slug.trim();
		slug=slug.toLowerCase();
        slug=slug.replace(/ /g,"-");
        slug=slug.replace(/[^a-z-A-Z ]/g,"");
        $('#slug').val(slug);
    }
    if(slug!='')
    {
        $.ajax({
            type: "POST",
            url: controller,
            data: { slug:slug, id:user_id },
            success: function(response)
            {
                if(response=='OK')
                {
					$("#slug").addClass('is-invalid');
                    $("#submitBtn").attr("disabled",true);
                    $('#slug_error').html('Slug already exist. Please enter different name.');
                }
                else
                {
					$("#slug").removeClass('is-invalid');
                    $("#submitBtn").attr("disabled",false);
                    $('#slug_error').html('');
                }
            }
        });
    }
}

function checkSlugone(controller, checkType,user_id,nameid)
{ 
	var name=$('#'+nameid).val();
    if(checkType=='checkFromName')
    {
        name=name.trim();
		name=name.toLowerCase();
        name=name.replace(/[^a-zA-Z ]/g,"");
        name=name.replace(/ /g,"-");
        $('#slug').val(name);
    }
    var slug=$('#slug').val();
    if(checkType=='checkFromSlug')
    {
		slug=slug.trim();
		slug=slug.toLowerCase();
        slug=slug.replace(/ /g,"-");
        slug=slug.replace(/[^a-z-A-Z ]/g,"");
        $('#slug').val(slug);
    }
    if(slug!='')
    {
        $.ajax({
            type: "POST",
            url: controller,
            data: { slug:slug, id:user_id },
            success: function(response)
            {console.log(response);
                if(response.staus=='OK')
                {   
					$("#slug").val(slug+'-'+response.length);
					
					//$("#slug").addClass('is-invalid');
                   // $("#submitBtn").attr("disabled",true);
                    //$('#slug_error').html('Slug already exist. Please enter different name.');
                }
                else
                {
					// $("#slug").removeClass('is-invalid');
                    // $("#submitBtn").attr("disabled",false);
					// $('#slug_error').html('');
					$("#slug").val(slug);
                }
            }
        });
    }
}

$(document).on("change", "#categoryId", function(){
	let id = $(this).val();
	$.ajax({
		type: 'POST',
		url: 'get_subcategory',
		data: {id:id},
		success: function(response) {
			if(response){
				$('#subcategoryData').html(response);	
			}
			else{
				$('#subcategoryData').html('');	
			}
		}
	});
});

$(document).on("change", "#subcategoryId", function(){
	let id = $(this).val();
	$.ajax({
		type: 'POST',
		url: 'get_product',
		data: {id:id},
		success: function(response) {
			if(response){
				$('#productData').html(response);	
			}
			else{
				$('#productData').html('');	
			}
		}
	});
});

$(document).on("change", "#fromStoreId", function(){
	let id = $(this).val();
	$.ajax({
		type: 'POST',
		url: 'get_filtered_store',
		data: {id:id},
		success: function(response) {
			if(response){
			$('#toStoreIdData').html(response);	
			}
			else{
			$('#toStoreIdData').html('');	
			}
		}
	});
});

$(document).on("click", "#statusChange", function(){
	const orderStatus = $("#orderStatusId").val();
	const odid = $("#odid").val();
	$.ajax({
		type: 'POST',
		url: 'change_order_status',
		data: {odid, orderStatus },
	});
});

$(document).on("change","#offerType",function(){
	var checkvalue = $(this).val();
	if(checkvalue=="percentage"){
	  $("#percentage_div").show();
	  $("#fixed_div").hide();
	} else {
	  $("#fixed_div").show();
	  $("#percentage_div").hide();
	}
});

function getProductByCatsubcat(id, fieldName, subcatDivId, prodDivId){
	id = id.value;
	if(fieldName == 'categoryId')
	{
		$.ajax({
			type: 'POST',
			url: 'get_subcat_by_cat',
			data: {id:id},
			success: function(response) {
				if(response){
					$('#'+subcatDivId).html(response);	
				}
				else{
					$('#'+subcatDivId).html('');	
				}
			}
		});
	}
	$.ajax({
		type: 'POST',
		url: 'get_product_by_cat_subcat',
		data: {id:id, fieldName:fieldName},
		success: function(response) {
			if(response){
				$('#'+prodDivId).html(response);	
			}
			else{
				$('#'+prodDivId).html('');	
			}
		}
	});
};

//Change status function
function changeStatusOrderDetail(obj, status, controller, returnFunction, tableId){
    let statusId = obj.attr('id');
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You want to change status?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, change it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: 'POST',
                url: controller+'/'+statusId,
                data: {status:status},
                success: function(response) {
                    if(response){
						$(`#${statusId}`).parent().html(response);
                    }
                }
              });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Your data is safe :)',
                'error'
            )
        }
    })
}

function getProductByMulCatsubcat(id, fieldName, subcatDivId, prodDivId){
	var fieldId = $(id).attr('id');
	var selectedValues = [];    
    $("#"+fieldId+" :selected").each(function(){
        selectedValues.push($(this).val()); 
	});
	if(fieldName == 'categoryId')
	{
		$.ajax({
			type: 'POST',
			url: 'get_subcat_by_mul_cat',
			data: {id:selectedValues},
			success: function(response) {
				if(response){
					$('#'+subcatDivId).html(response);	
				}
				else{
					$('#'+subcatDivId).html('');	
				}
			}
		});
	}
	$.ajax({
		type: 'POST',
		url: 'get_product_by_mul_cat_subcat',
		data: {id:selectedValues, fieldName:fieldName},
		success: function(response) {
			if(response){
				$('#'+prodDivId).html(response);	
			}
			else{
				$('#'+prodDivId).html('');	
			}
		}
	});
}

$(document).on("change", "#freeProductId", function(){
	let id = $(this).val();
	$.ajax({
		type: 'POST',
		url: 'get_varient',
		data: {id:id},
		success: function(response) {
			if(response){
				$('#freeVarientId').html(response);	
			}
			else{
				$('#freeVarientId').html('');	
			}
		}
	});
});


$(document).on("change", ".productId", function(){
	let id = $(this).val();
	let index = $(this).attr('id').split('_');
	index = index[1];
	var target = $(this);
    $.ajax({
		type: 'POST',
		url: 'get_varient',
		data: {id:id},
		success: function(response) {
			$('#varientId_'+index).html(response);
		}
    });
});