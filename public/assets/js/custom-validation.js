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
                // remote: {
                //     url: "check_slug_category",
                //     type: "post",
                //     data: {
                //         slug: function() {
                //             return $( "#slug" ).val();
                //         }
                //     }
                // }
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
    
    $('#addSubCategoryForm, #editSubCategoryForm').validate({
        rules: {
            categoryId: {
                required: true,
            },
            subcategory: {
                required: true,
            },
            slug: {
                required: true,   
            },
        },
        messages: {
            categoryId: {
                required: "Please enter a Category Name"
            },
            subcategory: {
                required: "Please enter a Sub Category Name"
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

    $('#addStoreForm, #editStoreForm').validate({
        rules: {
            store: {
                required: true,
            },
            stateId: {
                required: true,
            },
            cityId: {
                required: true,
            },
            address: {
                required: true,
            }
        },
        messages: {
            store: {
                required: "Please select Store Name"
            },
            stateId: {
                required: "Please select State"
            },
            cityId: {
                required: "Please select City"
            },
            address: {
                required: "Please enter a Store Address"
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

    $('#addProductForm,#editProductForm').validate({
        rules: {
            categoryId: {
                required: true,
            },
            subcategoryId: {
                required: true,
            },
            product: {
                required: true,
            },
            price: {
                required: true,
            },
            offer: {
                required: true, 
            },
            discount: {
                required: true, 
            },
            thumbnail: {
                required: true,
            }
        },
        messages: {
            categoryId: {
                required: "Please select Category Name"
            },
            subcategoryId: {
                required: "Please select Sub Category Name"
            },
            product: {
                required: "Please select Product Name"
            },
            price: {
                required: "Please enter Product Price"
            },
            offer: {
                required: "Please Select Product Offer"
            },
            discount: {
                required: "Please Select Product Discount"
            },
            thumbnail: {
                required: "Please Select Product Thumbnail Image"
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
    $('#addDiscountForm,#editDiscountForm').validate({
        rules: {
            coupon_no: {
                required: true,
            },
            coupon_name: {
                required: true,
            },
            min_order: {
                required: true,
            },
            no_of_uses: {
                required: true,
            },
            offertype: {
                required: true, 
            },
            from: {
                required: true, 
            },
            to: {
                required: true,
            },
            capping: {
                required: true,
            },
            applyfor: {
                required: true,
            }
        },
        messages: {
            coupon_no: {
                required: "Please enter Coupon Number"
            },
            coupon_name: {
                required: "Please Enter Coupon Name"
            },
            min_order: {
                required: "Please Enter Minimum Order Excluding GST"
            },
            no_of_uses: {
                required: "Please enter No Of Uses"
            },
            offertype: {
                required: "Please Enter Offer Type"
            },
            from: {
                required: "Please Enter From Date"
            },
            to: {
                required: "Please Enter To Date"
            },
            capping: {
                required: "Please Enter Capping"
            },
            applyfor: {
                required: "Please Enter Apply For"
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
    $('#addOfferForm,#editOfferForm').validate({
        rules: {
            offer_name: {
                required: true,
            },
            categoryId: {
                required: true,
            },
            subcategoryId: {
                required: true,
            },
            productId: {
                required: true,
            },
            offertype: {
                required: true,
            },
            min_cart_value: {
                required: true, 
            },
            from: {
                required: true, 
            },
            to: {
                required: true,
            },
            capping: {
                required: true,
            },
            applyfor: {
                required: true,
            }
        },
        messages: {
            offer_name: {
                required: "Please Enter Offer Name"
            },
            categoryId: {
                required: "Please select Category Name"
            },
            subcategoryId: {
                required: "Please select Sub Category Name"
            },
            productId: {
                required: "Please select Product Name"
            },
            offertype: {
                required: "Please enter Offer Type"
            },
            min_cart_value: {
                required: "Please Enter Minimum Cart Value"
            },
            from: {
                required: "Please Enter From Date"
            },
            to: {
                required: "Please Enter to Date"
            },
            capping: {
                required: "Please Enter Capping"
            },
            applyfor: {
                required: "Please Enter Apply For"
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

    $('#addBrandForm,#editBrandForm').validate({
        rules: {
            name: {
                required: true,
            }
        },
        messages: {
            name: {
                required: "Please Enter Brand Name"
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