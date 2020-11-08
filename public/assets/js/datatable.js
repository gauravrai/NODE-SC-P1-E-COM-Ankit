$(document).ready(function() {
    $('#roleTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_role',
            type: "POST",          
        }
    });

    $('#administratorTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_administrator',
            type: "POST",          
        }
    });

    $('#categoryTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_category',
            type: "POST",          
        }
    });
    
    $('#subcategoryTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_subcategory',
            type: "POST",          
        }
    });

    $('#stateTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_state',
            type: "POST",          
        }
    });

    $('#cityTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_city',
            type: "POST",          
        }
    });

    $('#pincodeTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_pincode',
            type: "POST",          
        }
    });

    $('#areaTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_area',
            type: "POST",          
        }
    });

    $('#societyTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_society',
            type: "POST",          
        }
    });

    $('#towerTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_tower',
            type: "POST",          
        }
    });
    $('#storeTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_store',
            type: "POST",          
        }
    });
    $('#productTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_product',
            type: "POST",          
        }
    });
    $('#stockTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_stock',
            type: "POST",          
        }
    });
    $('#orderTable').DataTable( {
        "searching": false,
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_order',
            data: {
              "search_option": $("#search_option").val(),
              "search_data": $("#search_data").val(),
              "order_status": $("#order_status").val(),
              "date_from": $("#date_from").val(),
              "date_to": $("#date_to").val(),
            },
            type: "POST",          
        }
    });
    $('#customerTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_customer',
            type: "POST",          
        }
    });
    $('#offerTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_offer',
            type: "POST",          
        }
    });
    $('#discountTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_discount',
            type: "POST",          
        }
    });

    $('#brandTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_brand',
            type: "POST",          
        }
    });

    $('#walletTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_wallet',
            type: "POST",          
        }
    });

    $('#varientTable').DataTable( {
        "scrollX": true,
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_varient',
            type: "POST",          
        }
    });
});

//Delete data function
function deleteData(id, controller, returnFunction, tableId){
    let deleteId = id.id;
    
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            console.log('coming');
            $.ajax({
                type: 'POST',
                url: controller+'/'+deleteId,
                success: function(response) {
                    if(response == 'done'){
                        $('#'+tableId+'Table').DataTable().destroy();
                        $('#'+tableId+'Table').DataTable( {
                            "processing": true,
                            "serverSide": true,
                            "ajax": {
                                url: returnFunction,
                                type: "POST",          
                              }
                        });
                        swalWithBootstrapButtons.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                    }else
                    {
                        swalWithBootstrapButtons.fire(
                            'Warning!',
                            'There are some active city in this state.',
                            'warning'
                        )
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

//Change status function
function changeStatus(id, status, controller, returnFunction, tableId){
    let statusId = id.id;
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
                        $('#'+tableId+'Table').DataTable().destroy();
                        $('#'+tableId+'Table').DataTable( {
                            "processing": true,
                            "serverSide": true,
                            "ajax": {
                                url: returnFunction,
                                type: "POST",          
                              }
                        });
                        swalWithBootstrapButtons.fire(
                            'Changed!',
                            'Your status has been changed successfully.',
                            'success'
                        )
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