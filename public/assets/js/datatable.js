$(document).ready(function() {
    $('#roleTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_role',
            type: "POST",          
          }
    });

    $('#administratorTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_administrator',
            type: "POST",          
          }
    });

    $('#categoryTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_category',
            type: "POST",          
          }
    });

    $('#stateTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_state',
            type: "POST",          
          }
    });

    $('#cityTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_city',
            type: "POST",          
          }
    });

    $('#pincodeTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_pincode',
            type: "POST",          
          }
    });

    $('#areaTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_area',
            type: "POST",          
          }
    });

    $('#societyTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_society',
            type: "POST",          
          }
    });

    $('#towerTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "ordering": false,
        "ajax": {
            url: 'list_society',
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
            $.ajax({
                type: 'POST',
                url: controller+'/'+deleteId,
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
                            'Deleted!',
                            'Your file has been deleted.',
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