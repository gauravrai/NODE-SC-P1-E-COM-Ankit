$(document).ready(function () {
    // $.validator.setDefaults({
    //     submitHandler: function () {
    //         alert( "Form successful submitted!" );
    //     }
    // });
    $('#addRoleForm, #editRoleForm').validate({
        rules: {
            name: {
                required: true,
            },
        },
        messages: {
            name: {
                required: "Please enter a Role Name",
            },
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });
    
    $('#addAdministratorForm, #editAdministratorForm').validate({
        rules: {
            name: {
                required: true,
            },
            email: {
                required: true,
                email: true,
            },
            username: {
                required: true,
            },
            password: {
                required: true
            },
            confirmpassword: {
                required: true,
                equalTo: "#password"
            },
            roleId: {
                required: true
            },
        },
        messages: {
            name: {
                required: "Please enter a Name",
            },
            email: {
                required: "Please enter a Email address",
                email: "Please enter a vaild Email address"
            },
            username: {
                required: "Please enter a Username"
            },
            password: {
                required: "Please provide a Password"
            },
            confirmpassword: {
                required: "Please provide a Confirm Password",
                equalTo: "Enter Confirm Password Same as Password"
            },
            roleId: {
                required: "Please select role"
            },
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });
    
    $('#addCategoryForm, #editCategoryForm').validate({
        rules: {
            name: {
                required: true,
            },
            slug: {
                required: true,
                remote: {
                    url: "check_slug_category",
                    type: "post",
                    data: {
                        slug: function() {
                            return $( "#slug" ).val();
                        }
                    }
                }
            },
        },
        messages: {
            name: {
                required: "Please enter a Name"
            },
            slug: {
                required: "Please enter a Slug",
                remote: "Slug already taken"
            }
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });
    
    $('#addStateForm, #editStateForm').validate({
        rules: {
            name: {
                required: true,
            }
        },
        messages: {
            name: {
                required: "Please enter a Name"
            }
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });
    
    $('#addCityForm, #editCityForm').validate({
        rules: {
            stateId: {
                required: true,
            },
            name: {
                required: true,
            }
        },
        messages: {
            stateId: {
                required: "Please select State"
            },
            name: {
                required: "Please enter a Name"
            }
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });
    
    $('#addPincodeForm, #editPincodeForm').validate({
        rules: {
            stateId: {
                required: true,
            },
            cityId: {
                required: true,
            },
            pincode: {
                required: true,
                number: true,
                minlength: 6,
                maxlength: 6
            }
        },
        messages: {
            stateId: {
                required: "Please select State"
            },
            cityId: {
                required: "Please select City"
            },
            pincode: {
                required: "Please enter a Pincode",
                number: "Please enter digits only",
                minlength: "Please enter six digits only",
                maxlength: "Please enter six digits only"
            }
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });
    
    $('#addAreaForm, #editAreaForm').validate({
        rules: {
            stateId: {
                required: true,
            },
            cityId: {
                required: true,
            },
            pincodeId: {
                required: true,
            },
            name: {
                required: true
            }
        },
        messages: {
            stateId: {
                required: "Please select State"
            },
            cityId: {
                required: "Please select City"
            },
            pincodeId: {
                required: "Please select Pincode"
            },
            name: {
                required: "Please enter Area Name"
            }
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });
    
    $('#addSocietyForm, #editSocietyForm').validate({
        rules: {
            stateId: {
                required: true,
            },
            cityId: {
                required: true,
            },
            pincodeId: {
                required: true,
            },
            areaId: {
                required: true
            },
            name: {
                required: true
            }
        },
        messages: {
            stateId: {
                required: "Please select State"
            },
            cityId: {
                required: "Please select City"
            },
            pincodeId: {
                required: "Please select Pincode"
            },
            areaId: {
                required: "Please select Area"
            },
            name: {
                required: "Please enter Society Name"
            }
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });
    
    $('#addTowerForm, #editTowerForm').validate({
        rules: {
            stateId: {
                required: true,
            },
            cityId: {
                required: true,
            },
            pincodeId: {
                required: true,
            },
            areaId: {
                required: true
            },
            soceityId: {
                required: true
            },
            name: {
                required: true
            }
        },
        messages: {
            stateId: {
                required: "Please select State"
            },
            cityId: {
                required: "Please select City"
            },
            pincodeId: {
                required: "Please select Pincode"
            },
            areaId: {
                required: "Please select Area"
            },
            soceityId: {
                required: "Please select Soceity"
            },
            name: {
                required: "Please enter tower Name"
            }
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });
});