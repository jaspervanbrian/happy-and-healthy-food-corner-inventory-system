$(document).ready(function() {
    var requestSupplierList;
	var requestPages;
    var currentPage;
    var totalPages;

    var sortBy = "name";
    var step = "ASC";

    var data = {
        type: $("#supplier_type").val(),
        keyword: $("#supplierSearchKeyword").val(),
    };

    getSuppliersPages(data);
    getSuppliers(data);
    currentPage = 1;

    function getSuppliers(data) {
    	if(requestSupplierList){
            requestSupplierList.abort();
        }
        var $form = $("#searchSupplierForm");
        requestSupplierList = $.ajax({
            url: $form.attr("action"),
            type: 'POST',
            data: data,
        });
        requestSupplierList.done(function (response, textStatus, jqXHR){
            var suppliers = JSON.parse(response);
            if (suppliers.length === 0) {
            	$("#supplierList").empty().append('<div class="alert alert-danger">No suppliers found.</div>');
                $("#delete_supplierModals").empty();
            } else {
                $("#delete_supplierModals").empty();
            	$("#supplierList").empty().append('<table class="table table-hover"> <thead class="thead-dark"> <tr> <th class="sortSupplierBy ' + (sortBy==="name" ? "sorted" : "") + '">Name ' + (sortBy==="name" && step==="ASC" ? "<span class=\"fa fa-caret-down\"></span>" : (sortBy==="name" && step==="DESC" ? ("<span class=\"fa fa-caret-up\"></span>") : "")) + '</th> <th class="sortSupplierBy ' + (sortBy==="location" ? "sorted" : "") + '">Location ' + (sortBy==="location" && step==="ASC" ? "<span class=\"fa fa-caret-down\"></span>" : (sortBy==="location" && step==="DESC" ? ("<span class=\"fa fa-caret-up\"></span>") : "")) + '</th><th>Contact Number</th><th></th></tr></thead> <tbody> </tbody></table>');
                $(".sortSupplierBy").on('click', function() {
                    var text = $.trim($(this).text());
                    var sorted = $.trim($("#stockList").find(".sorted").text());

                    if (text === "Name") {
                        sortBy = "name";
                        if (text === sorted) {
                            if (step === "ASC") {
                                step = "DESC";
                            } else if (step === "DESC") {
                                step = "ASC";
                            }
                        } else {
                            step = "ASC";
                        }
                        data = {
                            type: $("#supplier_type").val(),
                            keyword: $("#supplierSearchKeyword").val(),
                            page: currentPage,
                            orderby: sortBy,
                            step: step,
                        };
                        getSuppliers(data);
                    } else if (text === "Location") {
                        sortBy = "location";
                        if (text === sorted) {
                            if (step === "ASC") {
                                step = "DESC";
                            } else if (step === "DESC") {
                                step = "ASC";
                            }
                        } else {
                            step = "ASC";
                        }
                        data = {
                            type: $("#supplier_type").val(),
                            keyword: $("#supplierSearchKeyword").val(),
                            page: currentPage,
                            orderby: sortBy,
                            step: step,
                        };
                        getSuppliers(data);
                    }
                });
                $supplierRows = $("#supplierList").find('tbody');
                $.each(suppliers, function(i, supplier) {
                	$supplierRows.append('<tr><td>' + supplier.name + '</td><td>' + supplier.location + '</td><td>' + supplier.contact_number + '</td><td><button data-toggle="modal" data-target="#delete_supplier' + supplier.id + '" class="btn btn-outline-danger"><span class="fa fa-times"></span></button></td></tr>');
                	$("#delete_supplierModals").append('<div class="modal fade" id="delete_supplier' + supplier.id + '" tabindex="-1" role="dialog" aria-labelledby="delete_supplierModal' + supplier.id + '" aria-hidden="true"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="delete_supplierModal' + supplier.id + '">Remove Supplier</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true" class="fa fa-times"></span> </button> </div><div class="modal-body"> <h6>Are you sure you want to delete supplier <strong>' + supplier.name + '</strong>?</h6> </div><div class="modal-footer"> <form action="../../controllers/admin/DeleteSupplier.php" method="post"> <input type="hidden" name="supplier_id" value="' + supplier.id + '"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="submit" class="btn btn-danger">Delete</button> </form> </div></div></div></div>');
                });
			}
		});
		requestSupplierList.fail(function(jqXHR, textStatus, errorThrown) {
			$("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
		});
    }

	function getSuppliersPages(data) {
		if(requestPages){
            requestPages.abort();
        }
        requestPages = $.ajax({
            url: '../../controllers/admin/PaginateSupplier.php',
            type: 'POST',
            data: data,
        });
        requestPages.done(function(response, textStatus, jqXHR) {
            if (parseInt(response) > 7) {
                $("#supplierPagination").empty().append('<ul class="pagination"></ul>');
                var $pagination = $("#supplierPagination").find('.pagination');
                $pagination.append('<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>');
                totalPages = Math.ceil((parseInt(response)/7));
                for (var i = 1; i <= totalPages; i++) {
                    if (i === 1) {
                        $pagination.append('<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>');
                    } else {
                        $pagination.append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
                    }
                }
                $pagination.append('<li class="page-item"><a class="page-link" href="#">Next</a></li>');
            } else {
                $("#supplierPagination").empty();
            }
        })
        requestPages.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
	}

	$("#supplierSearchKeyword").on('keyup', function(e){
		data = {
			type: $("#supplier_type").val(),
			keyword: $("#supplierSearchKeyword").val(),
		};
		getSuppliersPages(data);
		getSuppliers(data);
		currentPage = 1;
	});

	$("#supplier_type").on('change', function(e){
		data = {
			type: $("#supplier_type").val(),
			keyword: $("#supplierSearchKeyword").val(),
		};
		getSuppliersPages(data);
		getSuppliers(data);
		currentPage = 1;
	});

	$("#supplierPagination").on('click', '.page-item', function() {
		if (!($(this).hasClass("disabled")))
		{
			if ($.trim($(this).text()) === "Previous") {
				if (currentPage === totalPages) {
					$("#supplierPagination").find(':contains("Next")').removeClass('disabled');
				}
				$("#supplierPagination").find(':contains(' + currentPage + ')').removeClass('active');
				currentPage -= 1;
				$("#supplierPagination").find(':contains(' + currentPage + ')').addClass('active');
				data = {
					type: $("#supplier_type").val(),
					keyword: $("#supplierSearchKeyword").val(),
					page: currentPage,
					orderby: sortBy,
					step: step,
				};
				getSuppliers(data);
				if (currentPage === 1) {
					$(this).addClass('disabled');
				}
			} else if ($.trim($(this).text()) === "Next") {
				if (currentPage === 1) {
					$("#supplierPagination").find(':contains("Previous")').removeClass('disabled');
				}
				$("#supplierPagination").find(':contains(' + currentPage + ')').removeClass('active');
				currentPage += 1;
				$("#supplierPagination").find(':contains(' + currentPage + ')').addClass('active');
				data = {
					type: $("#supplier_type").val(),
					keyword: $("#supplierSearchKeyword").val(),
					page: currentPage,
					orderby: sortBy,
					step: step,
				};
				getSuppliers(data);
				if (currentPage === totalPages) {
					$(this).addClass('disabled');
				}
			} else {
				$("#supplierPagination").find(':contains(' + currentPage + ')').removeClass('active');
				currentPage = parseInt($(this).text());
				$("#supplierPagination").find(':contains(' + currentPage + ')').addClass('active');
				data = {
					type: $("#supplier_type").val(),
					keyword: $("#supplierSearchKeyword").val(),
					page: currentPage,
					orderby: sortBy,
					step: step,
				};
				getSuppliers(data);
				if (currentPage === 1) {
					$("#supplierPagination").find(':contains("Previous")').addClass('disabled');
					$("#supplierPagination").find(':contains("Next")').removeClass('disabled');
				}
				if (currentPage === totalPages) {
					$("#supplierPagination").find(':contains("Previous")').removeClass('disabled');
					$("#supplierPagination").find(':contains("Next")').addClass('disabled');
				}
			}
		}
	});
});