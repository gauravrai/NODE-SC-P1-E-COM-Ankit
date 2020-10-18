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
            },
            thumbnail: {
                required: true,
            },
            small: {
                required: true,
            },
            large: {
                required: true,
            },
        },
        messages: {
            name: {
                required: "Please enter a Name"
            },
            slug: {
                required: "Please enter a Slug"
            },
            thumbnail: {
                required: "Please select thumbnail image"
            },
            small: {
                required: "Please select small image"
            },
            large: {
                required: "Please select large image"
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
            name: {
                required: true,
            },
            slug: {
                required: true,   
            },
            thumbnail: {
                required: true,
            },
            small: {
                required: true,
            },
            large: {
                required: true,
            },
        },
        messages: {
            categoryId: {
                required: "Please enter a Category Name"
            },
            name: {
                required: "Please enter a Sub Category Name"
            },
            slug: {
                required: "Please enter a Slug",
                remote: "Slug already taken"
            },
            thumbnail: {
                required: "Please select thumbnail image"
            },
            small: {
                required: "Please select small image"
            },
            large: {
                required: "Please select large image"
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
            name: {
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
            name: {
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
            name: {
                required: true,
            },
            brandId: {
                required: true,
            },
            offer: {
                required: true, 
            },
            discount: {
                required: true, 
            },
            stock: {
                required: true, 
            },
            description: {
                required: true, 
            },
        },
        messages: {
            categoryId: {
                required: "Please select Category"
            },
            subcategoryId: {
                required: "Please select Sub Category"
            },
            name: {
                required: "Please enter a Product Name"
            },
            subcategoryId: {
                required: "Please select Brand"
            },
            offer: {
                required: "Please Select Product Offer"
            },
            discount: {
                required: "Please Select Product Discount"
            },
            stock: {
                required: "Please enter a Stock Keeping Unit"
            },
            description: {
                required: "Please enter a Description"
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

    $('#addStockForm,#editStockForm').validate({
        rules: {
            productId: {
                required: true,
            },
            fromStoreId: {
                required: true,
            },
            toStoreId: {
                required: true,
            },
            variantId: {
                required: true,
            },
            count: {
                required: true,
            },
        },
        messages: {
            productId: {
                required: 'Please select product',
            },
            fromStoreId: {
                required: 'Please select from store',
            },
            toStoreId: {
                required: 'Please select to store',
            },
            variantId: {
                required: 'Please select variant',
            },
            count: {
                required: 'Please add count',
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

    $('#addDiscountForm,#editDiscountForm').validate({
        rules: {
            couponNo: {
                required: true,
            },
            couponName: {
                required: true,
            },
            orderValue: {
                required: true,
            },
            noOfUses: {
                required: true,
            },
            offerType: {
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
            applyFor: {
                required: true,
            }
        },
        messages: {
            couponNo: {
                required: "Please enter Coupon Number"
            },
            couponName: {
                required: "Please Enter Coupon Name"
            },
            orderValue: {
                required: "Please Enter Minimum Order Excluding GST"
            },
            noOfUses: {
                required: "Please enter No Of Uses"
            },
            offerType: {
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
            applyFor: {
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
            name: {
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
            offerType: {
                required: true,
            },
            cartValue: {
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
            applyFor: {
                required: true,
            }
        },
        messages: {
            name: {
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
            offerType: {
                required: "Please enter Offer Type"
            },
            cartValue: {
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
            applyFor: {
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