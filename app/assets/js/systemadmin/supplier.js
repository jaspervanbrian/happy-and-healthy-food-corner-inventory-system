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
                	$("#delete_supplierModals").append('');
                });
			}
		});
    }

	function getSuppliersPages(data) {

	}
});