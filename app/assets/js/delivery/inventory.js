$(document).ready(function() {
    var requestStockList;
	var requestPages;
    var currentPage;
    var totalPages;

    var sortBy = "name";
    var step = "ASC";

    var is_deleted = 0;
    var data = {
        type: $("#type").val(),
        keyword: $("#searchKeyword").val(),
        is_deleted: is_deleted,
    };
    getInventoryPages(data);
    getMainInventory(data);
    currentPage = 1;

    $("#inventory-tab").on('click', function(e) {
        $("#archives").empty();
        $("#inventory").empty().append('<form action="../../controllers/admin/Inventory.php" method="post" id="searchForm"><div class="form-group row p-t-20"><label for="searchBy" class="d-flex align-items-center">Search By:</label><div class="col-3"><select name="type" id="type" class="form-control"><option value="name">Stock name/brand</option><option value="category">Category</option><option value="status">Status</option><option value="unit">Unit</option></select></div><div class="col-6"><input type="text" class="form-control" name="searchKeyword" id="searchKeyword" placeholder="Enter keyword here..."></div><div class="col-2"><button type="button" data-toggle="modal" data-target="#add-item" class="btn btn-outline-success btn-block"><span class="fa fa-plus"></span> Add Stock</button></div></div></form><div class="row"><div class="col-12" id="stockList"></div></div><div class="row"><div class="col-12 d-flex justify-content-center" id="pagination"></div></div>');
        is_deleted = 0;
        data = {
            type: $("#type").val(),
            keyword: $("#searchKeyword").val(),
            is_deleted: is_deleted,
        };
        initialize();
        getInventoryPages(data);
        getMainInventory(data);
    });

    $("#archives-tab").on('click', function(e) {
        $("#inventory").empty();
        $("#archives").empty().append('<form action="../../controllers/admin/Inventory.php" method="post" id="searchForm"><div class="form-group row p-t-20"><label for="searchBy" class="d-flex align-items-center">Search By:</label><div class="col-3"><select name="type" id="type" class="form-control"><option value="name">Stock name/brand</option><option value="category">Category</option><option value="status">Status</option><option value="unit">Unit</option></select></div><div class="col-6"><input type="text" class="form-control" name="searchKeyword" id="searchKeyword" placeholder="Enter keyword here..."></div></div></form><div class="row"><div class="col-12" id="stockList"></div></div><div class="row"><div class="col-12 d-flex justify-content-center" id="pagination"></div></div>');
        is_deleted = 1;
        data = {
            type: $("#type").val(),
            keyword: $("#searchKeyword").val(),
            is_deleted: is_deleted,
        };
        initialize();
        getInventoryPages(data);
        getMainInventory(data);
    });

    initialize();
    function initialize() {
        $('#searchKeyword').bind('keypress keydown keyup', function(e){
            if(e.keyCode == 13) { e.preventDefault(); }
        });

        $("#searchKeyword").on('keyup', function(e){
            data = {
                type: $("#type").val(),
                keyword: $("#searchKeyword").val(),
                is_deleted: is_deleted,
            };
            getInventoryPages(data);
            getMainInventory(data);
            currentPage = 1;
        });

        $("#type").on('change', function(e){
            data = {
                type: $("#type").val(),
                keyword: $("#searchKeyword").val(),
                is_deleted: is_deleted,
            };
            getInventoryPages(data);
            getMainInventory(data);
            currentPage = 1;
        });

        $("#pagination").on('click', '.page-item', function() {
            if (!($(this).hasClass("disabled")))
            {
                if ($.trim($(this).text()) === "Previous") {
                    if (currentPage === totalPages) {
                        $("#pagination").find(':contains("Next")').removeClass('disabled');
                    }
                    $("#pagination").find(':contains(' + currentPage + ')').removeClass('active');
                    currentPage -= 1;
                    $("#pagination").find(':contains(' + currentPage + ')').addClass('active');
                    data = {
                        type: $("#type").val(),
                        keyword: $("#searchKeyword").val(),
                        page: currentPage,
                        orderby: sortBy,
                        step: step,
                        is_deleted: is_deleted,
                    };
                    getMainInventory(data);
                    if (currentPage === 1) {
                        $(this).addClass('disabled');
                    }
                } else if ($.trim($(this).text()) === "Next") {
                    if (currentPage === 1) {
                        $("#pagination").find(':contains("Previous")').removeClass('disabled');
                    }
                    $("#pagination").find(':contains(' + currentPage + ')').removeClass('active');
                    currentPage += 1;
                    $("#pagination").find(':contains(' + currentPage + ')').addClass('active');
                    data = {
                        type: $("#type").val(),
                        keyword: $("#searchKeyword").val(),
                        page: currentPage,
                        orderby: sortBy,
                        step: step,
                        is_deleted: is_deleted,
                    };
                    getMainInventory(data);
                    if (currentPage === totalPages) {
                        $(this).addClass('disabled');
                    }
                } else {
                    $("#pagination").find(':contains(' + currentPage + ')').removeClass('active');
                    currentPage = parseInt($(this).text());
                    $("#pagination").find(':contains(' + currentPage + ')').addClass('active');
                    data = {
                        type: $("#type").val(),
                        keyword: $("#searchKeyword").val(),
                        page: currentPage,
                        orderby: sortBy,
                        step: step,
                        is_deleted: is_deleted,
                    };
                    getMainInventory(data);
                    if (currentPage === 1) {
                        $("#pagination").find(':contains("Previous")').addClass('disabled');
                        $("#pagination").find(':contains("Next")').removeClass('disabled');
                    }
                    if (currentPage === totalPages) {
                        $("#pagination").find(':contains("Previous")').removeClass('disabled');
                        $("#pagination").find(':contains("Next")').addClass('disabled');
                    }
                }
            }
        });
    }

    function getInventoryPages(data) {
        if(requestPages){
            requestPages.abort();
        }
        requestPages = $.ajax({
            url: '../../controllers/admin/PaginateInventory.php',
            type: 'POST',
            data: data,
        });
        requestPages.done(function(response, textStatus, jqXHR) {
            if (parseInt(response) > 7) {
                $("#pagination").empty().append('<ul class="pagination"></ul>');
                var $pagination = $("#pagination").find('.pagination');
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
                $("#pagination").empty();
            }
        })
        requestPages.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    }

    function getMainInventory(data) 
    {
        if(requestStockList){
            requestStockList.abort();
        }
        var $form = $("#searchForm");
        requestStockList = $.ajax({
            url: $form.attr("action"),
            type: 'POST',
            data: data,
        });
        requestStockList.done(function (response, textStatus, jqXHR){
            var stocks = JSON.parse(response);
            if (stocks.length === 0) {
            	$("#stockList").empty().append('<div class="alert alert-danger">No items found.</div>');
                $("#stockModals").empty();
            } else {
                $("#stockModals").empty();
            	$("#stockList").empty().append('<table class="table table-hover"> <thead class="thead-dark"> <tr> <th class="sortBy ' + (sortBy==="name" ? "sorted" : "") + '">Name/Brand ' + (sortBy==="name" && step==="ASC" ? "<span class=\"fa fa-caret-down\"></span>" : (sortBy==="name" && step==="DESC" ? ("<span class=\"fa fa-caret-up\"></span>") : "")) + '</th> <th class="sortBy ' + (sortBy==="category" ? "sorted" : "") + '">Category ' + (sortBy==="category" && step==="ASC" ? "<span class=\"fa fa-caret-down\"></span>" : (sortBy==="category" && step==="DESC" ? ("<span class=\"fa fa-caret-up\"></span>") : "")) + '</th> <th class="sortBy ' + (sortBy==="current_qty" ? "sorted" : "") + '">Quantity ' + (sortBy==="current_qty" && step==="ASC" ? "<span class=\"fa fa-caret-down\"></span>" : (sortBy==="current_qty" && step==="DESC" ? ("<span class=\"fa fa-caret-up\"></span>") : "")) + '</th> <th class="sortBy ' + (sortBy==="unit" ? "sorted" : "") + '">Unit ' + (sortBy==="unit" && step==="ASC" ? "<span class=\"fa fa-caret-down\"></span>" : (sortBy==="unit" && step==="DESC" ? ("<span class=\"fa fa-caret-up\"></span>") : "")) + '</th> <th class="sortBy ' + (sortBy==="price" ? "sorted" : "") + '">Price ' + (sortBy==="price" && step==="ASC" ? "<span class=\"fa fa-caret-down\"></span>" : (sortBy==="price" && step==="DESC" ? ("<span class=\"fa fa-caret-up\"></span>") : "")) + '</th> <th class="sortBy ' + (sortBy==="status" ? "sorted" : "") + '">Status ' + (sortBy==="status" && step==="ASC" ? "<span class=\"fa fa-caret-down\"></span>" : (sortBy==="status" && step==="DESC" ? ("<span class=\"fa fa-caret-up\"></span>") : "")) + '</th> <th>Spoilages</th></tr></thead> <tbody> </tbody></table>');
                $(".sortBy").on('click', function() {
                    var text = $.trim($(this).text());
                    var sorted = $.trim($("#stockList").find(".sorted").text());

                    if (text === "Name/Brand") {
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
                            type: $("#type").val(),
                            keyword: $("#searchKeyword").val(),
                            page: currentPage,
                            orderby: sortBy,
                            step: step,
                        };
                        getMainInventory(data);
                    } else if (text === "Category") {
                        sortBy = "category";
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
                            type: $("#type").val(),
                            keyword: $("#searchKeyword").val(),
                            page: currentPage,
                            orderby: sortBy,
                            step: step,
                        };
                        getMainInventory(data);
                    } else if (text === "Quantity") {
                        sortBy = "current_qty";
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
                            type: $("#type").val(),
                            keyword: $("#searchKeyword").val(),
                            page: currentPage,
                            orderby: sortBy,
                            step: step,
                        };
                        getMainInventory(data);
                    } else if (text === "Unit") {
                        sortBy = "unit";
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
                            type: $("#type").val(),
                            keyword: $("#searchKeyword").val(),
                            page: currentPage,
                            orderby: sortBy,
                            step: step,
                        };
                        getMainInventory(data);
                    } else if (text === "Price") {
                        sortBy = "price";
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
                            type: $("#type").val(),
                            keyword: $("#searchKeyword").val(),
                            page: currentPage,
                            orderby: sortBy,
                            step: step,
                        };
                        getMainInventory(data);
                    } else if (text === "Status") {
                        sortBy = "status";
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
                            type: $("#type").val(),
                            keyword: $("#searchKeyword").val(),
                            page: currentPage,
                            orderby: sortBy,
                            step: step,
                        };
                        getMainInventory(data);
                    }
                });
            	$stockRows = $("#stockList").find('tbody');
            	$.each(stocks, function(i, stock) {
                    $stockRows.append('<tr data-toggle="modal" data-target="#stock' + stock.id + '"><td>' + stock.name + '</td><td>' + stock.category + '</td><td>' + stock.current_qty + '</td><td>' + stock.unit + '</td><td>₱' + stock.price + '</td><td class="' + (stock.status === "High Stock" ? "text-success" : "") + (stock.status === "Low Stock" ? "text-warning" : "") + (stock.status === "Needs Replenishment" ? "text-danger" : "") + (stock.status === "Out of stock" ? "text-secondary" : "") + '">' + stock.status + '</td><td id="spoilagesOnTable' + stock.id + '"></td></tr>');
                    if (is_deleted === 1) {
                        $("#stockModals").append('<div class="modal fade modal-big" id="stock' + stock.id + '" tabindex="-1" role="dialog" aria-labelledby="stockModal' + stock.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="stockModal' + stock.id + '">Stock Overview</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body"> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#general' + stock.id + '"><span class="fa fa-tasks"></span> General Summary</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#this-month' + stock.id + '"><span class="fa fa-line-chart"></span> Detailed Summary</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#monthly' + stock.id + '"><span class="fa fa-area-chart"></span> Monthly Summary Report</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#spoilages' + stock.id + '"><span class="fa fa-trash"></span> Spoilages Summary</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#recover-stock' + stock.id + '"><span class="fa fa-refresh"></span> Recover Stock</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#delete-stock' + stock.id + '"><span class="fa fa-times"></span> Delete Stock</a> </li></ul> <div class="tab-content"> <div class="tab-pane fade show active container" id="general' + stock.id + '"> <div class="row m-t-35"> <div class="col-6"> <h3>' + stock.name + '</h3> <p>Unit: ' + stock.unit + '</p><p>Price: ₱' + stock.price + ((stock.last_price_changed) ? " (Last updated at: " + stock.last_price_changed + ")" : "") + '</p><p>Low Threshold: ' + stock.low_threshold + '&nbsp;' + stock.unit + '</p></div><div class="col-6"> <p>Supplier: ' + stock.supplier + '</p><p>Supplier: ' + stock.supplier_location + '</p>' + ((stock.last_supplier_changed) ? " <p>(Supplier details was updated at: " + stock.last_supplier_changed + ")</p>" : "") + ' </div></div><hr> <div class="row"> <div class="col-6"> <small>Current Quantity:</small> <h5>' + stock.current_qty + " " + stock.unit + '</h5> </div><div class="col-6"> <small>Status:</small> <h5 class="' + (stock.status==="High Stock" ? "text-success" : "") + (stock.status==="Low Stock" ? "text-warning" : "") + (stock.status==="Needs Replenishment" ? "text-danger" : "") + (stock.status==="Out of stock" ? "text-secondary" : "") + '">' + stock.status + '</h5> </div></div><div class="row m-t-35"> <div class="col-6"> <small>Total Purchase Orders (Ins) this month:</small> <h5 id="ins' + stock.id + '"></h5> </div><div class="col-6"> <small>Total Deliveries (Outs) this month:</small> <h5 id="outs' + stock.id + '"></h5> </div></div><div class="row m-t-35"> <div class="col-6"> <small>Total Spoilages this month:</small> <h5 id="spoilagesTotal' + stock.id + '"></h5> </div></div></div><div class="tab-pane fade container-fluid" id="this-month' + stock.id + '"> <div class="row m-t-35"> <div class="col-6"> <h3>' + stock.name + '</h3> <p>Unit: ' + stock.unit + '</p><p>Price: ₱' + stock.price + ((stock.last_price_changed) ? " (Last updated at: " + stock.last_price_changed + ")" : "") + '</p></div></div><hr> <div class="row m-t-35"> <div class="col-5"> <select name="type_search" class="form-control" id="type_search' + stock.id + '"> <option value="All">All</option> <option value="Purchase Order">Purchase Order</option> <option value="Delivery">Delivery</option> <option value="Delivery to UST Branch">Delivery to UST Branch</option> <option value="Delivery to De La Salle Branch">Delivery to De La Salle Branch</option> </select> </div><div class="col-7"> <input type="text" name="reference_keyword_search" class="form-control" id="reference_keyword_search' + stock.id + '" placeholder="Enter supplier reference here"> </div></div><div class="row m-t-35"> <div class="col-12" id="particularList' + stock.id + '"> </div></div><div class="row m-t-35"> <div class="col-12" id="this-month-pagination' + stock.id + '"> </div></div></div><div class="tab-pane fade container-fluid" id="monthly' + stock.id + '"> <div class="row m-t-35"> <div class="col-6"> <h3>' + stock.name + '</h3> <p>Unit: ' + stock.unit + '</p><p>Price: ₱' + stock.price + ((stock.last_price_changed) ? " (Last updated at: " + stock.last_price_changed + ")" : "") + '</p></div></div><hr> <div class="row m-t-35"> <div class="col-12" id="monthlyReport' + stock.id + '"> </div></div></div><div class="tab-pane fade container-fluid" id="spoilages' + stock.id + '"> <div class="row m-t-35"> <div class="col-6"> <h3>' + stock.name + '</h3> <p>Unit: ' + stock.unit + '</p><p>Price: ₱' + stock.price + ((stock.last_price_changed) ? " (Last updated at: " + stock.last_price_changed + ")" : "") + '</p></div></div><hr> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#spoilagesSummary' + stock.id + '">Detailed spoilage summary</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#spoilagesChart' + stock.id + '">Spoilages report</a> </li></ul> <div class="tab-content"> <div class="tab-pane fade show active" id="spoilagesSummary' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <input type="text" name="spoilage_reference" class="form-control" id="spoilage_reference' + stock.id + '" placeholder="Enter supplier reference here"> </div></div><div class="row m-t-35"> <div class="col-12" id="spoilagesList' + stock.id + '"></div></div></div><div class="tab-pane fade" id="spoilagesChart' + stock.id + '"> <div class="row m-t-35"> <div class="col-12" id="monthlySpoilagesBody' + stock.id + '"> <canvas id="monthlySpoilages' + stock.id + '"></canvas> </div></div><hr> <div class="row"> <div class="col-12" id="monthlyPriceSpoilagesBody' + stock.id + '"> <canvas id="monthlyPriceSpoilages' + stock.id + '"></canvas> </div></div></div></div></div><div class="tab-pane fade container" id="recover-stock' + stock.id + '"> <form action="../../controllers/admin/Recover.php" method="post"> <input type="hidden" name="stock_id" value="' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <h3>Recover Stock</h3> <small class="text-info">This stock will be recovered from archived stocks. Recover?</small> </div></div><hr> <div class="row m-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-info">Recover this stock</button> </div></div></form> </div><div class="tab-pane fade container" id="delete-stock' + stock.id + '"> <form action="../../controllers/admin/PermDeleteStock.php" method="post"> <input type="hidden" name="stock_id" value="' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <h3>Delete Stock</h3> <small class="text-danger">Are you sure you want to delete this archived stock? All past transactions will be removed.</small> </div></div><hr> <div class="row m-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-danger">Delete this stock</button> </div></div></form> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div>');
                    } else if (is_deleted === 0) {
                        $("#stockModals").append('<div class="modal fade modal-big" id="stock' + stock.id + '" tabindex="-1" role="dialog" aria-labelledby="stockModal' + stock.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="stockModal' + stock.id + '">Stock Overview</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body"> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#add-particulars' + stock.id + '"><span class="fa fa-plus"></span> Add Particulars</a> </li></ul> <div class="tab-pane fade show active container" id="add-particulars' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <h3>Add Particular</h3> </div></div><hr> <div class="row m-t-35"> <div class="col-6"> <h4>' + stock.name + '</h4> <p>Unit: ' + stock.unit + '</p><p>Price: ₱' + stock.price + ((stock.last_price_changed) ? " (Last updated at: " + stock.last_price_changed + ")" : "") + '</p></div></div><hr> <form action="../../controllers/admin/AddParticular.php" method="post" class="addParticularForm"> <input type="hidden" name="stock_id" value="' + stock.id + '"> <div class="row m-t-35"> <div class="col-6"> <small>Type: <span class="text-danger">*</span></small> <select name="type" class="form-control" required> <option value="Delivery to UST Branch">Delivery to UST Branch</option> <option value="Delivery to De La Salle Branch">Delivery to De La Salle Branch</option> </select> </div><div class="col-6"> <small>Quantity: <span class="text-danger">*</span></small> <input type="number" step="any" value="0" min="0" name="qty" class="form-control" required> </div></div><div class="row m-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Add Particular</button> </div></div></form> </div></div><div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div>');
                    }
                    // ------------------------------------------- GET IN AND OUT TOTAL MONTHLY ----------------------------------------
                    var monthlyTotals = $.ajax({
                        url: '../../controllers/admin/GetMonthlyTotals.php',
                        type: 'POST',
                        data: {
                            stock_id: stock.id
                        },
                    });
                    monthlyTotals.done(function(response, textStatus, jqXHR) {
                        var totals = JSON.parse(response);

                        if (totals) {
                            $("#ins" + stock.id).text(parseFloat(totals.ins) + " " + stock.unit +" (₱" + (parseFloat(totals.ins) * parseFloat(stock.price)) + ")");
                            $("#outs" + stock.id).text(parseFloat(totals.outs) + " " + stock.unit +" (₱" + (parseFloat(totals.outs) * parseFloat(stock.price)) + ")");
                        } else {
                            $("#ins" + stock.id).text(0 + " " + stock.unit +" (₱0)");
                            $("#outs" + stock.id).text(0 + " " + stock.unit +" (₱0)");
                        }
                    });
                    monthlyTotals.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                    // -----------------------------------------------------------------------------------------------------------------
                    // ------------------------------------------- GET SPOILAGE TOTAL MONTHLY ------------------------------------------
                    var monthlyTotalSpoilage = $.ajax({
                        url: '../../controllers/admin/GetMonthlyTotalSpoilage.php',
                        type: 'POST',
                        data: {
                            stock_id: stock.id
                        },
                    });
                    monthlyTotalSpoilage.done(function(response, textStatus, jqXHR) {
                        var spoilagesTotal = JSON.parse(response);

                        if (spoilagesTotal) {
                            $("#spoilagesTotal"+stock.id).text(parseFloat(spoilagesTotal.spoilages) + " " + stock.unit +" (₱" + (parseFloat(spoilagesTotal.spoilages) * parseFloat(stock.price)) + ")");
                            $("#spoilagesOnTable"+stock.id).text(parseFloat(spoilagesTotal.spoilages) + " " + stock.unit +" (₱" + (parseFloat(spoilagesTotal.spoilages) * parseFloat(stock.price)) + ")");
                        } else {
                            $("#spoilagesTotal"+stock.id).text(0 + " " + stock.unit +" (₱0)");
                        }
                    });
                    monthlyTotalSpoilage.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                    // -----------------------------------------------------------------------------------------------------------------
                    var thisMonthData = {
                        stock_id: stock.id,
                        type_search: "All",
                        reference_keyword_search: "",
                    };
                    getPagination(thisMonthData);
                    getThisMonth(thisMonthData);

                    $("#type_search" + stock.id).on('change', function() {
                        thisMonthData = {
                            stock_id: stock.id,
                            type_search: $("#type_search" + stock.id).val(),
                            reference_keyword_search: $("#reference_keyword_search" + stock.id).val(),
                        };
                        getPagination(thisMonthData);
                        getThisMonth(thisMonthData);
                    });

                    $("#reference_keyword_search" + stock.id).on('keyup', function(e) {
                        if(e.keyCode == 13) {
                            e.preventDefault();
                            return false;
                        }
                        thisMonthData = {
                            stock_id: stock.id,
                            type_search: $("#type_search" + stock.id).val(),
                            reference_keyword_search: $("#reference_keyword_search" + stock.id).val(),
                        };
                        getPagination(thisMonthData);
                        getThisMonth(thisMonthData);
                    });

                    function getPagination(thisMonthData) {
                        //------------------------------------------PAGINATION-------------------------------------------------------
                        var thisMonthCurrentPage = 1;
                        var thisMonthTotalPages;
                        var requestForThisMonthPages = $.ajax({
                            url: '../../controllers/admin/PaginateThisMonth.php',
                            type: 'POST',
                            data: thisMonthData,
                        });
                        requestForThisMonthPages.done(function(response, textStatus, jqXHR) {
                            if (parseInt(response) > 5) {
                                $("#this-month-pagination"+ stock.id).empty().append('<ul class="pagination"></ul>');
                                var $thisMonthPagination = $("#this-month-pagination"+ stock.id).find('.pagination');
                                $thisMonthPagination.append('<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>');
                                thisMonthTotalPages = Math.ceil((parseInt(response)/5));
                                for (var i = 1; i <= thisMonthTotalPages; i++) {
                                    if (i === 1) {
                                        $thisMonthPagination.append('<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>');
                                    } else {
                                        $thisMonthPagination.append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
                                    }
                                }
                                $thisMonthPagination.append('<li class="page-item"><a class="page-link" href="#">Next</a></li>');
                            } else {
                                $("#this-month-pagination"+ stock.id).empty();
                            }
                        });
                        requestForThisMonthPages.fail(function(jqXHR, textStatus, errorThrown) {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                        });
                        $("#this-month-pagination"+ stock.id).on('click', '.page-item', function() {
                            if (!($(this).hasClass("disabled")))
                            {
                                if ($.trim($(this).text()) === "Previous") {
                                    if (thisMonthCurrentPage === thisMonthTotalPages) {
                                        $("#this-month-pagination"+ stock.id).find(':contains("Next")').removeClass('disabled');
                                    }
                                    $("#this-month-pagination"+ stock.id).find(':contains(' + thisMonthCurrentPage + ')').removeClass('active');
                                    thisMonthCurrentPage -= 1;
                                    $("#this-month-pagination"+ stock.id).find(':contains(' + thisMonthCurrentPage + ')').addClass('active');
                                    thisMonthData = {
                                        stock_id: stock.id,
                                        type_search: $("#type_search" + stock.id).val(),
                                        reference_keyword_search: $("#reference_keyword_search" + stock.id).val(),
                                        page: thisMonthCurrentPage,
                                    };
                                    getThisMonth(thisMonthData);
                                    if (thisMonthCurrentPage === 1) {
                                        $(this).addClass('disabled');
                                    }
                                } else if ($.trim($(this).text()) === "Next") {
                                    if (thisMonthCurrentPage === 1) {
                                        $("#this-month-pagination"+ stock.id).find(':contains("Previous")').removeClass('disabled');
                                    }
                                    $("#this-month-pagination"+ stock.id).find(':contains(' + thisMonthCurrentPage + ')').removeClass('active');
                                    thisMonthCurrentPage += 1;
                                    $("#this-month-pagination"+ stock.id).find(':contains(' + thisMonthCurrentPage + ')').addClass('active');
                                    thisMonthData = {
                                        stock_id: stock.id,
                                        type_search: $("#type_search" + stock.id).val(),
                                        reference_keyword_search: $("#reference_keyword_search" + stock.id).val(),
                                        page: thisMonthCurrentPage,
                                    };
                                    getThisMonth(thisMonthData);
                                    if (thisMonthCurrentPage === thisMonthTotalPages) {
                                        $(this).addClass('disabled');
                                    }
                                } else {
                                    $("#this-month-pagination"+ stock.id).find(':contains(' + thisMonthCurrentPage + ')').removeClass('active');
                                    thisMonthCurrentPage = parseInt($(this).text());
                                    $("#this-month-pagination"+ stock.id).find(':contains(' + thisMonthCurrentPage + ')').addClass('active');
                                    thisMonthData = {
                                        stock_id: stock.id,
                                        type_search: $("#type_search" + stock.id).val(),
                                        reference_keyword_search: $("#reference_keyword_search" + stock.id).val(),
                                        page: thisMonthCurrentPage,
                                    };
                                    getThisMonth(thisMonthData);
                                    if (thisMonthCurrentPage === 1) {
                                        $("#this-month-pagination"+ stock.id).find(':contains("Previous")').addClass('disabled');
                                        $("#this-month-pagination"+ stock.id).find(':contains("Next")').removeClass('disabled');
                                    }
                                    if (thisMonthCurrentPage === thisMonthTotalPages) {
                                        $("#this-month-pagination"+ stock.id).find(':contains("Previous")').removeClass('disabled');
                                        $("#this-month-pagination"+ stock.id).find(':contains("Next")').addClass('disabled');
                                    }
                                }
                            }
                        });
                        //-------------------------------------------------------------------------------------------------------------
                    }
                    //------------------------------------------------GET THIS MONTH-----------------------------------------------
                    function getThisMonth(thisMonthData) {
                        var ins = 0;
                        var outs = 0;

                        var requestThisMonth = $.ajax({
                            url: '../../controllers/admin/ThisMonth.php',
                            type: 'POST',
                            data: thisMonthData,
                        });
                        requestThisMonth.done(function(response, textStatus, jqXHR) {
                            var particulars = JSON.parse(response);
                            if (particulars.length === 0) {
                                $("#this-month-pagination"+ stock.id).empty();
                                $("#particularList"+ stock.id).empty().append('<div class="alert alert-info">No transactions found.</div>');
                            } else {
                                $("#particularList"+ stock.id).empty().append('<table class="table table-hover"> <thead class="thead-dark"> <th>Date</th> <th>Time</th> <th>Type</th> <th>Supplier Reference</th> <th>In</th> <th>Out</th> <th>Balance</th> <th>Price</th> <th>Issued by</th> </thead> <tbody></tbody> </table>');
                                var $particularRows = $("#particularList"+ stock.id).find('tbody');
                                $.each(particulars, function(i, particular) {
                                    $particularRows.append('<tr><td>' + particular.date + '</td><td>' + particular.time + '</td><td>' + particular.type + '</td><td>' + particular.supplier_reference + '</td><td>' + particular.in + " " + stock.unit + '</td><td>' + particular.out + " " + stock.unit + '</td><td>' + particular.balance + " " + stock.unit + '</td><td>₱' + particular.price_balance + '</td><td>' + particular.issued_by + '</td></tr>');
                                });
                            }
                        });
                        requestThisMonth.fail(function(jqXHR, textStatus, errorThrown) {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                        });                        
                    }
                    //-------------------------------------------------------------------------------------------------------------
                    //--------------------------------------------MONTHLY BALANCE REPORT-------------------------------------------
                    var monthlyBalances = [];
                    var monthlyBalancesMonths = [];
                    var monthlyPriceBalances = [];

                    var requestMonthlyBalanceReport = $.ajax({
                        url: '../../controllers/admin/MonthlyReport.php',
                        type: 'POST',
                        data: {
                            stock_id: stock.id,
                        },
                    });
                    requestMonthlyBalanceReport.done(function(response, textStatus, jqXHR) {
                        var monthlyBalanceReport = JSON.parse(response);
                        if (monthlyBalanceReport.length <= 0) {
                            $("#monthlyReport" + stock.id).empty().append('<div class="alert alert-info">There are no transactions for stock yet.</div>');
                        } else {
                            $("#monthlyReport" + stock.id).empty().append('<ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#monthlyReportBalance' + stock.id + '">Monthly Balances Report</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#monthlyReportIns' + stock.id + '">Total Purchase Orders Per Month</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#monthlyReportOuts' + stock.id + '">Total Deliveries Per Month</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#monthlyReportOutsUST' + stock.id + '">Total Deliveries To UST Branch</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#monthlyReportOutsDLSU' + stock.id + '">Total Deliveries To DLSU Branch</a> </li></ul><div class="tab-content"> <div class="tab-pane fade show active container-fluid" id="monthlyReportBalance' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <canvas id="monthlyBalanceChart' + stock.id + '"></canvas> <hr> <canvas id="monthlyPriceBalanceChart' + stock.id + '"></canvas> </div></div></div><div class="tab-pane fade container-fluid" id="monthlyReportIns' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <canvas id="monthlyInsChart' + stock.id + '"></canvas> <hr> <canvas id="monthlyPriceInsChart' + stock.id + '"></canvas> </div></div></div><div class="tab-pane fade container-fluid" id="monthlyReportOuts' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <canvas id="monthlyOutsChart' + stock.id + '"></canvas> <hr> <canvas id="monthlyPriceOutsChart' + stock.id + '"></canvas> </div></div></div><div class="tab-pane fade container-fluid" id="monthlyReportOutsUST' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <canvas id="monthlyOutsUSTChart' + stock.id + '"></canvas> <hr> <canvas id="monthlyPriceOutsUSTChart' + stock.id + '"></canvas> </div></div></div><div class="tab-pane fade container-fluid" id="monthlyReportOutsDLSU' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <canvas id="monthlyOutsDLSUChart' + stock.id + '"></canvas> <hr> <canvas id="monthlyPriceOutsDLSUChart' + stock.id + '"></canvas> </div></div></div></div>');
                            $.each(monthlyBalanceReport, function(i, report) {
                                monthlyBalances.push(parseFloat(report.balance));
                                monthlyBalancesMonths.push(report.month);
                                monthlyPriceBalances.push(report.price_balance);
                            });
                            let myBalanceChart = document.getElementById("monthlyBalanceChart" + stock.id).getContext('2d');
                            let monthlyBalanceChart = new Chart(myBalanceChart, {
                                type: 'bar',
                                data: {
                                    labels: monthlyBalancesMonths,
                                    datasets: [{
                                        label: "Monthly Balance (" + stock.unit + ")",
                                        data: monthlyBalances,
                                        backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)',
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)',
                                        ],
                                        borderColor: [
                                        'rgba(255,99,132,1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)',
                                        'rgba(255,99,132,1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)',
                                        ],
                                        borderWidth: 1
                                    }],
                                },
                                options: {
                                    title: {
                                        display: true,
                                        text: 'Monthly Balances This Year',
                                        fontSize: 25,
                                    },
                                    legend: {
                                        position: 'right',
                                        fontColor: '#000',
                                    }
                                }
                            });
                            let myPriceBalanceChart = document.getElementById("monthlyPriceBalanceChart" + stock.id).getContext('2d');
                            let monthlyPriceBalanceChart = new Chart(myPriceBalanceChart, {
                                type: 'line',
                                data: {
                                    labels: monthlyBalancesMonths,
                                    datasets: [{
                                        label: "Amount of monthly balance (₱)",
                                        data: monthlyPriceBalances,
                                        backgroundColor: [
                                        'rgba(75, 192, 192, 0.2)',
                                        ],
                                        borderColor: [
                                        'rgba(75, 192, 192, 1)',
                                        ],
                                        borderWidth: 1
                                    }],
                                },
                                options: {
                                    title: {
                                        display: true,
                                        text: 'Amounts',
                                        fontSize: 25,
                                    },
                                    legend: {
                                        position: 'right',
                                        fontColor: '#000',
                                    }
                                }
                            });
                            //-------------------------------------MONTHLY INS REPORT----------------------------------------------
                            var monthlyIns = [];
                            var monthlyPriceIns = [];
                            var monthlyInsMonths = [];

                            var requestMonthlyInsReport = $.ajax({
                                url: '../../controllers/admin/MonthlyReportIns.php',
                                type: 'POST',
                                data: {
                                    stock_id: stock.id,
                                },
                            });
                            requestMonthlyInsReport.done(function(response, textStatus, jqXHR) {
                                var monthlyInsReport = JSON.parse(response);
                                if (monthlyInsReport.length <= 0) {
                                    $("#monthlyReportIns" + stock.id).empty().append('<div class="row m-t-35"><div class="col-12"><div class="alert alert-info">There are no Purchase Orders for this stock yet.</div></div></div>');
                                } else {
                                    $.each(monthlyInsReport, function(i, report) {
                                        monthlyIns.push(parseFloat(report.ins));
                                        monthlyPriceIns.push(parseFloat(report.price_balance));
                                        monthlyInsMonths.push(report.month);
                                    });
                                    let myInsChart = document.getElementById("monthlyInsChart" + stock.id).getContext('2d');
                                    let monthlyInsChart = new Chart(myInsChart, {
                                        type: 'bar',
                                        data: {
                                            labels: monthlyInsMonths,
                                            datasets: [{
                                                label: "Monthly Purchase Orders (" + stock.unit + ")",
                                                data: monthlyIns,
                                                backgroundColor: [
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                ],
                                                borderColor: [
                                                'rgba(255,99,132,1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255,99,132,1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                ],
                                                borderWidth: 1
                                            }],
                                        },
                                        options: {
                                            title: {
                                                display: true,
                                                text: 'Monthly Purchase Orders this year',
                                                fontSize: 25,
                                            },
                                            legend: {
                                                position: 'right',
                                                fontColor: '#000',
                                            }
                                        }
                                    });
                                    let myPriceInsChart = document.getElementById("monthlyPriceInsChart" + stock.id).getContext('2d');
                                    let monthlyPriceInsChart = new Chart(myPriceInsChart, {
                                        type: 'line',
                                        data: {
                                            labels: monthlyInsMonths,
                                            datasets: [{
                                                label: "Amount (₱)",
                                                data: monthlyPriceIns,
                                                backgroundColor: [
                                                'rgba(75, 192, 192, 0.2)',
                                                ],
                                                borderColor: [
                                                'rgba(75, 192, 192, 1)',
                                                ],
                                                borderWidth: 1
                                            }],
                                        },
                                        options: {
                                            title: {
                                                display: true,
                                                text: 'Amount of Purchase Orders (₱)',
                                                fontSize: 25,
                                            },
                                            legend: {
                                                position: 'right',
                                                fontColor: '#000',
                                            }
                                        }
                                    });
                                }
                            });
                            requestMonthlyInsReport.fail(function(jqXHR, textStatus, errorThrown) {
                                $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                            });
                            //-----------------------------------------------------------------------------------------------------
                            //--------------------------------------MONTHLY OUTS REPORT--------------------------------------------
                            var monthlyOuts = [];
                            var monthlyPriceOuts = [];
                            var monthlyOutsMonths = [];

                            var requestMonthlyOutsReport = $.ajax({
                                url: '../../controllers/admin/MonthlyReportOuts.php',
                                type: 'POST',
                                data: {
                                    stock_id: stock.id,
                                },
                            });
                            requestMonthlyOutsReport.done(function(response, textStatus, jqXHR) {
                                var monthlyOutsReport = JSON.parse(response);
                                if (monthlyOutsReport.length <= 0) {
                                    $("#monthlyReportOuts" + stock.id).empty().append('<div class="row m-t-35"><div class="col-12"><div class="alert alert-info">There are no Deliveries for this stock yet.</div></div></div>');
                                } else {
                                    $.each(monthlyOutsReport, function(i, report) {
                                        monthlyOuts.push(parseFloat(report.outs));
                                        monthlyPriceOuts.push(parseFloat(report.price_balance));
                                        monthlyOutsMonths.push(report.month);
                                    });
                                    let myOutsChart = document.getElementById("monthlyOutsChart" + stock.id).getContext('2d');
                                    let monthlyOutsChart = new Chart(myOutsChart, {
                                        type: 'bar',
                                        data: {
                                            labels: monthlyOutsMonths,
                                            datasets: [{
                                                label: "Monthly Deliveries (" + stock.unit + ")",
                                                data: monthlyOuts,
                                                backgroundColor: [
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                ],
                                                borderColor: [
                                                'rgba(255,99,132,1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255,99,132,1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                ],
                                                borderWidth: 1
                                            }],
                                        },
                                        options: {
                                            title: {
                                                display: true,
                                                text: 'Monthly Deliveries this year',
                                                fontSize: 25,
                                            },
                                            legend: {
                                                position: 'right',
                                                fontColor: '#000',
                                            }
                                        }
                                    });
                                    let myPriceOutsChart = document.getElementById("monthlyPriceOutsChart" + stock.id).getContext('2d');
                                    let monthlyPriceOutsChart = new Chart(myPriceOutsChart, {
                                        type: 'line',
                                        data: {
                                            labels: monthlyOutsMonths,
                                            datasets: [{
                                                label: "Amount (₱)",
                                                data: monthlyPriceOuts,
                                                backgroundColor: [
                                                'rgba(75, 192, 192, 0.2)',
                                                ],
                                                borderColor: [
                                                'rgba(75, 192, 192, 1)',
                                                ],
                                                borderWidth: 1
                                            }],
                                        },
                                        options: {
                                            title: {
                                                display: true,
                                                text: 'Amount of Deliveries (₱)',
                                                fontSize: 25,
                                            },
                                            legend: {
                                                position: 'right',
                                                fontColor: '#000',
                                            }
                                        }
                                    });
                                }
                            });
                            requestMonthlyOutsReport.fail(function(jqXHR, textStatus, errorThrown) {
                                $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                            });
                            //-----------------------------------------------------------------------------------------------------
                            //--------------------------------------MONTHLY OUTS UST REPORT----------------------------------------
                            var monthlyOutsUST = [];
                            var monthlyPriceOutsUST = [];
                            var monthlyOutsMonthsUST = [];

                            var requestMonthlyOutsUSTReport = $.ajax({
                                url: '../../controllers/admin/MonthlyReportOutsUST.php',
                                type: 'POST',
                                data: {
                                    stock_id: stock.id,
                                },
                            });
                            requestMonthlyOutsUSTReport.done(function(response, textStatus, jqXHR) {
                                var monthlyOutsReport = JSON.parse(response);
                                if (monthlyOutsReport.length <= 0) {
                                    $("#monthlyReportOutsUST" + stock.id).empty().append('<div class="row m-t-35"><div class="col-12"><div class="alert alert-info">There are no Deliveries to UST Branch for this stock yet.</div></div></div>');
                                } else {
                                    $.each(monthlyOutsReport, function(i, report) {
                                        monthlyOutsUST.push(parseFloat(report.outs));
                                        monthlyPriceOutsUST.push(parseFloat(report.price_balance));
                                        monthlyOutsMonthsUST.push(report.month);
                                    });
                                    let myOutsUSTChart = document.getElementById("monthlyOutsUSTChart" + stock.id).getContext('2d');
                                    let monthlyOutsUSTChart = new Chart(myOutsUSTChart, {
                                        type: 'bar',
                                        data: {
                                            labels: monthlyOutsMonthsUST,
                                            datasets: [{
                                                label: "Monthly Deliveries (" + stock.unit + ")",
                                                data: monthlyOutsUST,
                                                backgroundColor: [
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                ],
                                                borderColor: [
                                                'rgba(255,99,132,1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255,99,132,1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                ],
                                                borderWidth: 1
                                            }],
                                        },
                                        options: {
                                            title: {
                                                display: true,
                                                text: 'Monthly Deliveries to UST Branch this year',
                                                fontSize: 25,
                                            },
                                            legend: {
                                                position: 'right',
                                                fontColor: '#000',
                                            }
                                        }
                                    });
                                    let myPriceOutsUSTChart = document.getElementById("monthlyPriceOutsUSTChart" + stock.id).getContext('2d');
                                    let monthlyPriceOutsUSTChart = new Chart(myPriceOutsUSTChart, {
                                        type: 'line',
                                        data: {
                                            labels: monthlyOutsMonthsUST,
                                            datasets: [{
                                                label: "Amount (₱)",
                                                data: monthlyPriceOutsUST,
                                                backgroundColor: [
                                                'rgba(75, 192, 192, 0.2)',
                                                ],
                                                borderColor: [
                                                'rgba(75, 192, 192, 1)',
                                                ],
                                                borderWidth: 1
                                            }],
                                        },
                                        options: {
                                            title: {
                                                display: true,
                                                text: 'Amount of Deliveries to UST Branch (₱)',
                                                fontSize: 25,
                                            },
                                            legend: {
                                                position: 'right',
                                                fontColor: '#000',
                                            }
                                        }
                                    });
                                }
                            });
                            requestMonthlyOutsUSTReport.fail(function(jqXHR, textStatus, errorThrown) {
                                $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                            });
                            //-----------------------------------------------------------------------------------------------------
                            //--------------------------------------MONTHLY OUTS UST REPORT----------------------------------------
                            var monthlyOutsDLSU = [];
                            var monthlyPriceOutsDLSU = [];
                            var monthlyOutsMonthsDLSU = [];

                            var requestMonthlyOutsDLSUReport = $.ajax({
                                url: '../../controllers/admin/MonthlyReportOutsDLSU.php',
                                type: 'POST',
                                data: {
                                    stock_id: stock.id,
                                },
                            });
                            requestMonthlyOutsDLSUReport.done(function(response, textStatus, jqXHR) {
                                var monthlyOutsReport = JSON.parse(response);
                                if (monthlyOutsReport.length <= 0) {
                                    $("#monthlyReportOutsDLSU" + stock.id).empty().append('<div class="row m-t-35"><div class="col-12"><div class="alert alert-info">There are no Deliveries to DLSU Branch for this stock yet.</div></div></div>');
                                } else {
                                    $.each(monthlyOutsReport, function(i, report) {
                                        monthlyOutsDLSU.push(parseFloat(report.outs));
                                        monthlyPriceOutsDLSU.push(parseFloat(report.price_balance));
                                        monthlyOutsMonthsDLSU.push(report.month);
                                    });
                                    let myOutsDLSUChart = document.getElementById("monthlyOutsDLSUChart" + stock.id).getContext('2d');
                                    let monthlyOutsDLSUChart = new Chart(myOutsDLSUChart, {
                                        type: 'bar',
                                        data: {
                                            labels: monthlyOutsMonthsDLSU,
                                            datasets: [{
                                                label: "Monthly Deliveries (" + stock.unit + ")",
                                                data: monthlyOutsDLSU,
                                                backgroundColor: [
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                ],
                                                borderColor: [
                                                'rgba(255,99,132,1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255,99,132,1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                ],
                                                borderWidth: 1
                                            }],
                                        },
                                        options: {
                                            title: {
                                                display: true,
                                                text: 'Monthly Deliveries to UST Branch this year',
                                                fontSize: 25,
                                            },
                                            legend: {
                                                position: 'right',
                                                fontColor: '#000',
                                            }
                                        }
                                    });
                                    let myPriceOutsDLSUChart = document.getElementById("monthlyPriceOutsDLSUChart" + stock.id).getContext('2d');
                                    let monthlyPriceOutsDLSUChart = new Chart(myPriceOutsDLSUChart, {
                                        type: 'line',
                                        data: {
                                            labels: monthlyOutsMonthsDLSU,
                                            datasets: [{
                                                label: "Amount (₱)",
                                                data: monthlyPriceOutsDLSU,
                                                backgroundColor: [
                                                'rgba(75, 192, 192, 0.2)',
                                                ],
                                                borderColor: [
                                                'rgba(75, 192, 192, 1)',
                                                ],
                                                borderWidth: 1
                                            }],
                                        },
                                        options: {
                                            title: {
                                                display: true,
                                                text: 'Amount of Deliveries to UST Branch (₱)',
                                                fontSize: 25,
                                            },
                                            legend: {
                                                position: 'right',
                                                fontColor: '#000',
                                            }
                                        }
                                    });
                                }
                            });
                            requestMonthlyOutsDLSUReport.fail(function(jqXHR, textStatus, errorThrown) {
                                $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                            });
                            //-----------------------------------------------------------------------------------------------------
                        }
                    });
                    requestMonthlyBalanceReport.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                    //-------------------------------------------------------------------------------------------------------------
                    //---------------------------------------------SPOILAGES-------------------------------------------------------
                    var stock_spoilage = {
                        stock_id: stock.id,
                        spoilage_reference: $("#spoilage_reference" + stock.id).val(),
                    };
                    getThisSpoilage(stock_spoilage);

                    $("#spoilage_reference" + stock.id).on('keyup', function(e) {
                        if(e.keyCode == 13) {
                            e.preventDefault();
                            return false;
                        }
                        stock_spoilage = {
                            stock_id: stock.id,
                            spoilage_reference: $("#spoilage_reference" + stock.id).val(),
                        };
                        getThisSpoilage(stock_spoilage);
                    });

                    function getThisSpoilage(stock_spoilage) {
                        var spoilagesTotal = 0;
                        var requestSpoilagesHistory = $.ajax({
                            url: '../../controllers/admin/Spoilages.php',
                            type: 'POST',
                            data: stock_spoilage,
                        });
                        requestSpoilagesHistory.done(function(response, textStatus, jqXHR) {
                            var spoilages = JSON.parse(response);
                            if (spoilages.length === 0) {
                                $("#spoilagesList"+ stock.id).empty().append('<div class="alert alert-info">No spoilages found.</div>');
                            } else {
                                $("#spoilagesList"+ stock.id).empty().append('<table class="table table-hover"> <thead class="thead-dark"> <th>Date</th> <th>Time</th> <th>Reference Code</th> <th>Spoilages</th> <th>Balance</th> <th>Cost</th> <th>Issued by</th> </thead> <tbody></tbody> </table>');
                                var $spoilagesRows = $("#spoilagesList"+ stock.id).find('tbody');
                                $.each(spoilages, function(i, spoilage) {
                                    $spoilagesRows.append('<tr><td>' + spoilage.date + '</td><td>' + spoilage.time + '</td><td>' + spoilage.supplier_reference + '</td><td>' + spoilage.amount + " " + stock.unit + '</td><td>' + spoilage.balance + " " + stock.unit + '</td><td>₱' + spoilage.price_balance + '</td><td>' + spoilage.issued_by + '</td></tr>');
                                });
                            }
                        });
                        requestSpoilagesHistory.fail(function(jqXHR, textStatus, errorThrown) {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                        });                        
                    }
                    //-------------------------------------------MONTHLY SPOILAGES REPORT------------------------------------------
                    var monthlySpoilages = [];
                    var monthlyPriceSpoilages = [];
                    var monthlySpoilagesMonths = [];

                    var requestMonthlySpoilagesReport = $.ajax({
                        url: '../../controllers/admin/MonthlyReportSpoilages.php',
                        type: 'POST',
                        data: {
                            stock_id: stock.id,
                        },
                    });
                    requestMonthlySpoilagesReport.done(function(response, textStatus, jqXHR) {
                        var monthlySpoilagesReport = JSON.parse(response);
                        if (monthlySpoilagesReport.length <= 0) {
                            $("#spoilagesChart" + stock.id).empty().append('<div class="row m-t-35"><div class="col-12"><div class="alert alert-info">There are no Spoilages for this stock yet.</div></div></div>');
                        } else {
                            $("#spoilagesChart" + stock.id).empty().append('<div class="row m-t-35"> <div class="col-12" id="monthlySpoilagesBody' + stock.id + '"> <canvas id="monthlySpoilages' + stock.id + '"></canvas> </div></div><hr> <div class="row"> <div class="col-12" id="monthlyPriceSpoilagesBody' + stock.id + '"> <canvas id="monthlyPriceSpoilages' + stock.id + '"></canvas> </div></div>');
                            $.each(monthlySpoilagesReport, function(i, report) {
                                monthlySpoilages.push(parseFloat(report.spoilages));
                                monthlyPriceSpoilages.push(parseFloat(report.price_balance));
                                monthlySpoilagesMonths.push(report.month);
                            });
                            let mySpoilagesChart = document.getElementById("monthlySpoilages" + stock.id).getContext('2d');
                            let monthlySpoilagesChart = new Chart(mySpoilagesChart, {
                                type: 'bar',
                                data: {
                                    labels: monthlySpoilagesMonths,
                                    datasets: [{
                                        label: "Monthly Spoilages (" + stock.unit + ")",
                                        data: monthlySpoilages,
                                        backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)',
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)',
                                        ],
                                        borderColor: [
                                        'rgba(255,99,132,1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)',
                                        'rgba(255,99,132,1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)',
                                        ],
                                        borderWidth: 1
                                    }],
                                },
                                options: {
                                    title: {
                                        display: true,
                                        text: 'Monthly Spoilages this year',
                                        fontSize: 25,
                                    },
                                    legend: {
                                        position: 'right',
                                        fontColor: '#000',
                                    }
                                }
                            });
                            let myPriceSpoilagesChart = document.getElementById("monthlyPriceSpoilages" + stock.id).getContext('2d');
                            let monthlyPriceSpoilagesChart = new Chart(myPriceSpoilagesChart, {
                                type: 'line',
                                data: {
                                    labels: monthlySpoilagesMonths,
                                    datasets: [{
                                        label: "Amount (₱)",
                                        data: monthlyPriceSpoilages,
                                        backgroundColor: [
                                        'rgba(75, 192, 192, 0.2)',
                                        ],
                                        borderColor: [
                                        'rgba(75, 192, 192, 1)',
                                        ],
                                        borderWidth: 1
                                    }],
                                },
                                options: {
                                    title: {
                                        display: true,
                                        text: 'Amount of Spoilages (₱)',
                                        fontSize: 25,
                                    },
                                    legend: {
                                        position: 'right',
                                        fontColor: '#000',
                                    }
                                }
                            });
                        }
                    });
                    requestMonthlySpoilagesReport.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                    //-------------------------------------------------------------------------------------------------------------
            	});
                //-----------------------------------------ADD PARTICULAR SUBMIT --------------------------------------------------
                $(".addParticularForm").on('submit', function(e) {
                    e.preventDefault();
                    var $thisAddParticularForm = $(this);
                    var $modal = $(this).closest('.modal');
                    var requestAddParticular = $.ajax({
                        url: $thisAddParticularForm.attr("action"),
                        type: 'POST',
                        data: {
                            stock_id: $thisAddParticularForm.find("input[name='stock_id']").val(),
                            type: $thisAddParticularForm.find("select[name='type']").val(),
                            qty: $thisAddParticularForm.find("input[name='qty']").val(),
                        },
                    });
                    requestAddParticular.done(function(response, textStatus, jqXHR) {
                        if (response === "ok") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Add particular successful!").delay( 5000 ).slideUp(300);
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                            getMainInventory(data);
                        } else if (response === "qty<out") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-warning").show().append("You have insufficient amount of quantity on this stock.").delay( 5000 ).slideUp(300);    
                        } else if (response === "delivery0") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Out quantity must not be 0 if Delivery is selected.").delay( 5000 ).slideUp(300);
                        } else if (response === "purchase0") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("In quantity must not be 0 if Purchase is selected.").delay( 5000 ).slideUp(300);
                        }
                    });
                    requestAddParticular.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                    
                });
                //-----------------------------------------------------------------------------------------------------------------
                //-----------------------------------------ADD SPOILAGE SUBMIT --------------------------------------------------
                $(".addSpoilageForm").on('submit', function(e) {
                    e.preventDefault();
                    var $thisAddSpoilageForm = $(this);
                    var $modal = $(this).closest('.modal');
                    var requestAddSpoilage = $.ajax({
                        url: $thisAddSpoilageForm.attr("action"),
                        type: 'POST',
                        data: {
                            stock_id: $thisAddSpoilageForm.find("input[name='stock_id']").val(),
                            quantity: $thisAddSpoilageForm.find("input[name='quantity']").val(),
                        },
                    });
                    requestAddSpoilage.done(function(response, textStatus, jqXHR) {
                        if (response === "ok") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Add spoilage issue successful!").delay( 5000 ).slideUp(300);
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                            getMainInventory(data);
                        } else if (response === "qty<out") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-warning").show().append("You have insufficient amount of quantity on this stock.").delay( 5000 ).slideUp(300);    
                        } else if (response === "err") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Error adding particular. Check inputs again.").delay( 5000 ).slideUp(300);
                        }
                    });
                    requestAddSpoilage.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                });
                //-----------------------------------------------------------------------------------------------------------------
                //-----------------------------------------UPDATE STOCK DETAILS -----------------------------------------------------------
                $(".changeStockDetails").on('submit', function(e) {
                    e.preventDefault();
                    var $thisChangeStockDetailsForm = $(this);
                    var $modal = $(this).closest('.modal');
                    var requestChangeStockDetails = $.ajax({
                        url: $thisChangeStockDetailsForm.attr("action"),
                        type: 'POST',
                        data: {
                            stock_id: $thisChangeStockDetailsForm.find("input[name='stock_id']").val(),
                            former_name: $thisChangeStockDetailsForm.find("input[name='former_name']").val(),
                            name: $thisChangeStockDetailsForm.find("input[name='name']").val(),
                            category: $thisChangeStockDetailsForm.find("select[name='category']").val(),
                            unit: $thisChangeStockDetailsForm.find("select[name='unit']").val(),
                            current_qty: $thisChangeStockDetailsForm.find("input[name='current_qty']").val(),
                            low_threshold: $thisChangeStockDetailsForm.find("input[name='low_threshold']").val(),
                        },
                    });
                    requestChangeStockDetails.done(function(response, textStatus, jqXHR) {
                        if (response === "ok") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Change stock details successful!").delay( 5000 ).slideUp(300);
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                            getMainInventory(data);
                        }
                    });
                    requestChangeStockDetails.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                });
                //-----------------------------------------------------------------------------------------------------------------
                //-----------------------------------------UPDATE PRICE -----------------------------------------------------------
                $(".changeStockPrice").on('submit', function(e) {
                    e.preventDefault();
                    var $thisChangeStockPriceForm = $(this);
                    var $modal = $(this).closest('.modal');
                    var requestChangeStockPrice = $.ajax({
                        url: $thisChangeStockPriceForm.attr("action"),
                        type: 'POST',
                        data: {
                            stock_id: $thisChangeStockPriceForm.find("input[name='stock_id']").val(),
                            stock_price: $thisChangeStockPriceForm.find("input[name='stock_price']").val(),
                        },
                    });
                    requestChangeStockPrice.done(function(response, textStatus, jqXHR) {
                        if (response === "ok") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Change stock price successful!").delay( 5000 ).slideUp(300);
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                            getMainInventory(data);
                        }
                    });
                    requestChangeStockPrice.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                });
                //-----------------------------------------------------------------------------------------------------------------
                //-----------------------------------------UPDATE SUPPLIER --------------------------------------------------------
                $(".changeStockSupplier").on('submit', function(e) {
                    e.preventDefault();
                    var $thisChangeStockSupplierForm = $(this);
                    var $modal = $(this).closest('.modal');
                    var requestChangeStockSupplier = $.ajax({
                        url: $thisChangeStockSupplierForm.attr("action"),
                        type: 'POST',
                        data: {
                            stock_id: $thisChangeStockSupplierForm.find("input[name='stock_id']").val(),
                            supplier: $thisChangeStockSupplierForm.find("input[name='supplier']").val(),
                            supplier_location: $thisChangeStockSupplierForm.find("input[name='supplier_location']").val(),
                        },
                    });
                    requestChangeStockSupplier.done(function(response, textStatus, jqXHR) {
                        if (response === "ok") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Update stock supplier details successful!").delay( 5000 ).slideUp(300);
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                            getMainInventory(data);
                        }
                    });
                    requestChangeStockSupplier.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                });
                //-----------------------------------------------------------------------------------------------------------------
            }
        });
        requestStockList.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    }
});