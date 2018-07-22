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
                        $("#stockModals").append('<div class="modal fade modal-big" id="stock' + stock.id + '" tabindex="-1" role="dialog" aria-labelledby="stockModal' + stock.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="stockModal' + stock.id + '">Stock Overview</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body"> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#general' + stock.id + '"><span class="fa fa-tasks"></span> General Summary</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#spoilages' + stock.id + '"><span class="fa fa-trash"></span> Spoilages Summary</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#recover-stock' + stock.id + '"><span class="fa fa-refresh"></span> Recover Stock</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#delete-stock' + stock.id + '"><span class="fa fa-times"></span> Delete Stock</a> </li></ul> <div class="tab-content"> <div class="tab-pane fade show active container" id="general' + stock.id + '"> <div class="row m-t-35"> <div class="col-6"> <h3>' + stock.name + '</h3> <p>Unit: ' + stock.unit + '</p><p>Price: ₱' + stock.price + ((stock.last_price_changed) ? " (Last updated at: " + stock.last_price_changed + ")" : "") + '</p><p>Low Threshold: ' + stock.low_threshold + '&nbsp;' + stock.unit + '</p></div><div class="col-6"> <p>Supplier: ' + stock.supplier + '</p><p>Supplier: ' + stock.supplier_location + '</p>' + ((stock.last_supplier_changed) ? " <p>(Supplier details was updated at: " + stock.last_supplier_changed + ")</p>" : "") + ' </div></div><hr> <div class="row"> <div class="col-6"> <small>Current Quantity:</small> <h5>' + stock.current_qty + " " + stock.unit + '</h5> </div><div class="col-6"> <small>Status:</small> <h5 class="' + (stock.status==="High Stock" ? "text-success" : "") + (stock.status==="Low Stock" ? "text-warning" : "") + (stock.status==="Needs Replenishment" ? "text-danger" : "") + (stock.status==="Out of stock" ? "text-secondary" : "") + '">' + stock.status + '</h5> </div></div><div class="row m-t-35"> <div class="col-6"> <small>Total Purchase Orders (Ins) this month:</small> <h5 id="ins' + stock.id + '"></h5> </div><div class="col-6"> <small>Total Deliveries (Outs) this month:</small> <h5 id="outs' + stock.id + '"></h5> </div></div><div class="row m-t-35"> <div class="col-6"> <small>Total Spoilages this month:</small> <h5 id="spoilagesTotal' + stock.id + '"></h5> </div></div></div><div class="tab-pane fade container-fluid" id="spoilages' + stock.id + '"> <div class="row m-t-35"> <div class="col-6"> <h3>' + stock.name + '</h3> <p>Unit: ' + stock.unit + '</p><p>Price: ₱' + stock.price + ((stock.last_price_changed) ? " (Last updated at: " + stock.last_price_changed + ")" : "") + '</p></div></div><hr> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#spoilagesSummary' + stock.id + '">Detailed spoilage summary</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#spoilagesChart' + stock.id + '">Spoilages report</a> </li></ul> <div class="tab-content"> <div class="tab-pane fade show active" id="spoilagesSummary' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <input type="text" name="spoilage_reference" class="form-control" id="spoilage_reference' + stock.id + '" placeholder="Enter supplier reference here"> </div></div><div class="row m-t-35"> <div class="col-12" id="spoilagesList' + stock.id + '"></div></div></div><div class="tab-pane fade" id="spoilagesChart' + stock.id + '"> <div class="row m-t-35"> <div class="col-12" id="monthlySpoilagesBody' + stock.id + '"> <canvas id="monthlySpoilages' + stock.id + '"></canvas> </div></div><hr> <div class="row"> <div class="col-12" id="monthlyPriceSpoilagesBody' + stock.id + '"> <canvas id="monthlyPriceSpoilages' + stock.id + '"></canvas> </div></div></div></div></div><div class="tab-pane fade container" id="recover-stock' + stock.id + '"> <form action="../../controllers/admin/Recover.php" method="post"> <input type="hidden" name="stock_id" value="' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <h3>Recover Stock</h3> <small class="text-info">This stock will be recovered from archived stocks. Recover?</small> </div></div><hr> <div class="row m-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-info">Recover this stock</button> </div></div></form> </div><div class="tab-pane fade container" id="delete-stock' + stock.id + '"> <form action="../../controllers/admin/PermDeleteStock.php" method="post"> <input type="hidden" name="stock_id" value="' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <h3>Delete Stock</h3> <small class="text-danger">Are you sure you want to delete this archived stock? All past transactions will be removed.</small> </div></div><hr> <div class="row m-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-danger">Delete this stock</button> </div></div></form> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div>');
                    } else if (is_deleted === 0) {
                        $("#stockModals").append('<div class="modal fade modal-big" id="stock' + stock.id + '" tabindex="-1" role="dialog" aria-labelledby="stockModal' + stock.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="stockModal' + stock.id + '">Stock Overview</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body"> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#general' + stock.id + '"><span class="fa fa-tasks"></span> General Summary</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#spoilages' + stock.id + '"><span class="fa fa-trash"></span> Spoilages Summary</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#delete-stock' + stock.id + '"><span class="fa fa-archive"></span> Archive Stock</a> </li></ul> <div class="tab-content"> <div class="tab-pane fade show active container" id="general' + stock.id + '"> <div class="row m-t-35"> <div class="col-6"> <h3>' + stock.name + ((stock.former_name) ? ("&nbsp;&nbsp;<small>(Formerly " + stock.former_name + ")</small>") : "")+'</h3> <p>Unit: ' + stock.unit + '</p><p>Price: ₱' + stock.price + ((stock.last_price_changed) ? " (Last updated at: " + stock.last_price_changed + ")" : "") + '</p><p>Low Threshold: ' + stock.low_threshold + '&nbsp;' + stock.unit + '</p></div><div class="col-6"> <p>Supplier: ' + stock.supplier + '</p><p>Supplier: ' + stock.supplier_location + '</p>' + ((stock.last_supplier_changed) ? " <p>(Supplier details was updated at: " + stock.last_supplier_changed + ")</p>" : "") + ' </div></div><hr> <div class="row"> <div class="col-6"> <small>Current Quantity:</small> <h5>' + stock.current_qty + " " + stock.unit + '</h5> </div><div class="col-6"> <small>Status:</small> <h5 class="' + (stock.status==="High Stock" ? "text-success" : "") + (stock.status==="Low Stock" ? "text-warning" : "") + (stock.status==="Needs Replenishment" ? "text-danger" : "") + (stock.status==="Out of stock" ? "text-secondary" : "") + '">' + stock.status + '</h5> </div></div><div class="row m-t-35"> <div class="col-6"> <small>Total Purchase Orders (Ins) this month:</small> <h5 id="ins' + stock.id + '"></h5> </div><div class="col-6"> <small>Total Deliveries (Outs) this month:</small> <h5 id="outs' + stock.id + '"></h5> </div></div><div class="row m-t-35"> <div class="col-6"> <small>Total Spoilages this month:</small> <h5 id="spoilagesTotal' + stock.id + '"></h5> </div></div><hr> <form action="../../controllers/admin/EditStockDetails.php" method="post" class="changeStockDetails"> <div class="row"> <div class="col-6"> <h6>Update stock details</h6> </div></div><div class="row m-t-35"> <input type="hidden" name="stock_id" value="' + stock.id + '"> <input type="hidden" name="former_name" value="' + stock.name + '"> <input type="hidden" name="current_qty" value="' + stock.current_qty + '"> <div class="col-12"> <small>Name: <span class="text-danger">*</span></small> <input type="text" name="name" class="form-control" required> </div></div><div class="row m-t-35"> <div class="col-6"> <small>Category: <span class="text-danger">*</span></small> <select name="category" class="form-control" required> <option value="Meat">Meat</option> <option value="Vegetables">Vegetables</option> <option value="Packaging">Packaging</option> <option value="Grocery">Grocery</option> <option value="Rice">Rice</option> <option value="Sauce">Sauce</option> <option value="Fruits">Fruits</option> </select> </div><div class="col-6"> <small>Unit: <span class="text-danger">*</span></small> <select name="unit" class="form-control" required> <option value="gallons">gallons</option> <option value="grams">grams</option> <option value="kgs">kgs</option> <option value="liters">liters</option> <option value="pack">pack</option> <option value="pieces">pieces</option> <option value="oz">oz</option> </select> </div></div><div class="row m-t-35"> <div class="col-6"> <small>Low Threshold <span class="text-danger">*</span></small> <input type="number" step="any" min="0.0001" class="form-control" name="low_threshold" required> </div></div><div class="row m-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Update Stock Details</button> </div></div></form> <hr> <form action="../../controllers/admin/EditStockPrice.php" method="post" class="changeStockPrice"> <div class="row"> <input type="hidden" name="stock_id" value="' + stock.id + '"> <div class="col-3"> <h6 class="align-items-center">Change Price to (₱):</h6> </div><div class="col-6"> <input type="number" step="any" min="0.0001" name="stock_price" class="form-control" required> </div><div class="col-3"> <button type="submit" class="btn btn-success btn-block">Change Price</button> </div></div></form> <hr> <form action="../../controllers/admin/EditStockSupplier.php" method="post" class="changeStockSupplier"> <div class="row"> <div class="col-6"> <h6>Update supplier details</h6> </div></div><div class="row m-t-35"> <input type="hidden" name="stock_id" value="' + stock.id + '"> <select name="supplier" class="form-control supplier_list" id="supplier' + stock.id + '" required> <option value="" selected> </option> </select> </div><div class="row m-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Update Supplier Details</button> </div></div></form> </div><div class="tab-pane fade container-fluid" id="spoilages' + stock.id + '"> <div class="row m-t-35"> <div class="col-6"> <h3>' + stock.name + '</h3> <p>Unit: ' + stock.unit + '</p><p>Price: ₱' + stock.price + ((stock.last_price_changed) ? " (Last updated at: " + stock.last_price_changed + ")" : "") + '</p></div></div><hr> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#spoilagesSummary' + stock.id + '">Detailed spoilage summary</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#spoilagesChart' + stock.id + '">Spoilages report</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#add_spoilage' + stock.id + '">Add spoilage issue</a> </li></ul> <div class="tab-content"> <div class="tab-pane fade show active" id="spoilagesSummary' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <input type="text" name="spoilage_reference" class="form-control" id="spoilage_reference' + stock.id + '" placeholder="Enter supplier reference here"> </div></div><div class="row m-t-35"> <div class="col-12" id="spoilagesList' + stock.id + '"></div></div></div><div class="tab-pane fade" id="spoilagesChart' + stock.id + '"> <div class="row m-t-35"> <div class="col-12" id="monthlySpoilagesBody' + stock.id + '"> <canvas id="monthlySpoilages' + stock.id + '"></canvas> </div></div><hr> <div class="row"> <div class="col-12" id="monthlyPriceSpoilagesBody' + stock.id + '"> <canvas id="monthlyPriceSpoilages' + stock.id + '"></canvas> </div></div></div><div class="tab-pane fade" id="add_spoilage' + stock.id + '"> <div class="row m-t-35"> <div class="col-6"> <h6>Add Spoilage Issue</h6> </div></div><form action="../../controllers/admin/AddSpoilage.php" method="post" class="addSpoilageForm"> <input type="hidden" name="stock_id" value="' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <small>Quantity of spoiled product: <span class="text-danger">*</span></small> <input type="number" step="any" min="0.0001" name="quantity" class="form-control" required> </div></div><div class="row m-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Submit</button> </div></div></form> </div></div></div><div class="tab-pane fade container" id="delete-stock' + stock.id + '"> <form action="../../controllers/admin/DeleteStock.php" method="post"> <input type="hidden" name="stock_id" value="' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <h3>Archive Stock</h3> <small class="text-danger">Are you sure you want to archive this stock? All past transactions will be archived.</small> </div></div><hr> <div class="row m-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-danger">Archive this stock</button> </div></div></form> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div>');
                        var suppliers = $.ajax({
                            url: '../../controllers/admin/SupplierList.php',
                            type: 'POST',
                        });
                        suppliers.done(function(response, textStatus, jqXHR) {
                            var supplier_list = JSON.parse(response);
                            if (supplier_list.length > 0) {
                                $.each(supplier_list, function(i, supplier) {
                                    $("#supplier" + stock.id).append('<option value="' + supplier.id + '">' + supplier.name + '</option>')
                                });
                            }
                        });
                        suppliers.fail(function(jqXHR, textStatus, errorThrown) {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                        });
                    }
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
                            supplier: $thisChangeStockSupplierForm.find("select[name='supplier']").val(),
                        },
                    });
                    requestChangeStockSupplier.done(function(response, textStatus, jqXHR) {
                        console.log(response)
                        if (response === "ok") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Update stock supplier details successful!").delay( 5000 ).slideUp(300);
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                            getMainInventory(data);
                        } else {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Error. Invalid supplier.").delay( 5000 ).slideUp(300);
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