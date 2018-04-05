$(document).ready(function() {
    var requestStockList;
	var requestPages;
    var currentPage;
    var totalPages;

    var data = {
        type: $("#type").val(),
        keyword: $("#searchKeyword").val(),
    };
    getInventoryPages(data);
    getMainInventory(data);
    currentPage = 1;

    $("#searchKeyword").on('keyup', function(e){
        data = {
            type: $("#type").val(),
            keyword: $("#searchKeyword").val(),
        };
        getInventoryPages(data);
        getMainInventory(data);
        currentPage = 1;
    });

    $("#type").on('change', function(e){
        data = {
            type: $("#type").val(),
            keyword: $("#searchKeyword").val(),
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
            	$("#stockList").empty().append('<table class="table table-hover"><thead class="thead-dark"><tr><th>Name/Brand</th><th>Quantity</th><th>Unit</th><th>Status</th></tr></thead><tbody></tbody></table>');
            	$stockRows = $("#stockList").find('tbody');
            	$.each(stocks, function(i, stock) {
                    $stockRows.append('<tr data-toggle="modal" data-target="#stock' + stock.id + '"><td>' + stock.name + '</td><td>' + stock.current_qty + '</td><td>' + stock.unit + '</td><td class="' + (stock.status === "High Stock" ? "text-success" : "") + (stock.status === "Low Stock" ? "text-warning" : "") + (stock.status === "Needs Replenishment" ? "text-danger" : "") + (stock.status === "Out of stock" ? "text-secondary" : "") + '">' + stock.status + '</td></tr>');
                    $("#stockModals").append('<div class="modal fade modal-big" id="stock' + stock.id + '" tabindex="-1" role="dialog" aria-labelledby="stockModal' + stock.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="stockModal' + stock.id + '">View Stock</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body"> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#general' + stock.id + '"><span class="fa fa-tasks"></span> General Summary</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#this-month' + stock.id + '"><span class="fa fa-line-chart"></span> Detailed Summary</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#monthly' + stock.id + '"><span class="fa fa-area-chart"></span> Monthly Summary Report</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#add-particulars' + stock.id + '"><span class="fa fa-plus"></span> Add Particulars</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#delete-stock' + stock.id + '"><span class="fa fa-times"></span> Delete Stock</a> </li></ul> <div class="tab-content"> <div class="tab-pane fade show active container" id="general' + stock.id + '"> <div class="row m-t-35"> <div class="col-6"> <h3>' + stock.name + '</h3> <small>Unit: ' + stock.unit + '</small> </div></div><hr> <div class="row"> <div class="col-6"> <small>Current Quantity:</small> <h5>' + stock.current_qty + '</h5> </div><div class="col-6"> <small>Status:</small> <h5 class="' + (stock.status==="High Stock" ? "text-success" : "") + (stock.status==="Low Stock" ? "text-warning" : "") + (stock.status==="Needs Replenishment" ? "text-danger" : "") + (stock.status==="Out of stock" ? "text-secondary" : "") + '">' + stock.status + '</h5> </div></div><div class="row m-t-35"> <div class="col-6"> <small>Total Ins this month:</small> <h5 id="ins' + stock.id + '"></h5> </div><div class="col-6"> <small>Total Outs this month:</small> <h5 id="outs' + stock.id + '"></h5> </div></div></div><div class="tab-pane fade container-fluid" id="this-month' + stock.id + '"> <div class="row m-t-35"> <div class="col-6"> <h3>' + stock.name + '</h3> <small>Unit: ' + stock.unit + '</small> </div><div class="col-6"> <h6>Legend:</h6> <p><small>DR: Delivery Receipt</small></p><p><small>PO: Purchase Order</small></p></div></div><hr> <div class="row m-t-35"> <div class="col-12" id="particularList' + stock.id + '"> </div></div><div class="row m-t-35"> <div class="col-12" id="this-month-pagination' + stock.id + '"> </div></div></div><div class="tab-pane fade container-fluid" id="monthly' + stock.id + '"> <div class="row m-t-35"> <div class="col-12" id="monthlyReport' + stock.id + '"> </div></div></div><div class="tab-pane fade container" id="add-particulars' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <h3>Add Particular</h3> </div></div><hr> <div class="row m-t-35"> <div class="col-6"> <h6>' + stock.name + '</h6> <small>Unit: ' + stock.unit + '</small> </div><div class="col-6"> <h6>Legend:</h6> <p><small>DR: Delivery Receipt</small></p><p><small>PO: Purchase Order</small></p></div></div><hr> <form action="../../controllers/admin/AddParticular.php" method="post" class="addParticularForm"> <input type="hidden" name="stock_id" value="' + stock.id + '"> <div class="row m-t-35"> <div class="col-6"> <small>Type: <span class="text-danger">*</span></small> <input type="text" name="type" class="form-control"> </div><div class="col-6"> <small>Supplier Reference: <span class="text-danger">*</span></small> <input type="text" name="supplier_reference" class="form-control"> </div></div><div class="row m-t-35"> <div class="col-6"> <small>In: <span class="text-danger">*</span></small> <input type="number" step="any" min="0" value="0" name="in" class="form-control"> </div><div class="col-6"> <small>Out: <span class="text-danger">*</span></small> <input type="number" step="any" min="0" value="0" name="out" class="form-control"> </div></div><div class="row m-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Add Particular</button> </div></div></form> </div><div class="tab-pane fade container" id="delete-stock' + stock.id + '"> <form action="../../controllers/admin/DeleteStock.php" method="post"> <input type="hidden" name="stock_id" value="' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <h3>Delete Stock</h3> <small class="text-danger">Are you sure you want to delete this stock? All past transactions will be removed.</small> </div></div><hr> <div class="row m-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-danger">Delete this stock</button> </div></div></form> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div>');
                    //------------------------------------------PAGINATION-------------------------------------------------------
                    var thisMonthCurrentPage = 1;
                    var thisMonthTotalPages;
                    var thisMonthData = {
                        stock_id: stock.id
                    };
                    var requestForThisMonthPages = $.ajax({
                        url: '../../controllers/admin/PaginateThisMonth.php',
                        type: 'POST',
                        data: thisMonthData,
                    });
                    requestForThisMonthPages.done(function(response, textStatus, jqXHR) {
                        if (parseInt(response) > 10) {
                            $("#this-month-pagination"+ stock.id).empty().append('<ul class="pagination"></ul>');
                            var $thisMonthPagination = $("#this-month-pagination"+ stock.id).find('.pagination');
                            $thisMonthPagination.append('<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>');
                            thisMonthTotalPages = Math.ceil((parseInt(response)/10));
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
                    //------------------------------------------------GET THIS MONTH-----------------------------------------------
                    getThisMonth(thisMonthData);
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
                                $("#particularList"+ stock.id).empty().append('<div class="alert alert-info">There are no transactions for this month yet.</div>');
                            } else {
                                $("#particularList"+ stock.id).empty().append('<table class="table table-hover"> <thead class="thead-dark"> <th>Date</th> <th>Time</th> <th>Type</th> <th>Supplier Reference</th> <th>In</th> <th>Out</th> <th>Balance</th> <th>Issued by</th> </thead> <tbody></tbody> </table>');
                                var $particularRows = $("#particularList"+ stock.id).find('tbody');
                                $.each(particulars, function(i, particular) {
                                    ins += parseFloat(particular.in);
                                    outs += parseFloat(particular.out);
                                    $particularRows.append('<tr><td>' + particular.date + '</td><td>' + particular.time + '</td><td>' + particular.type + '</td><td>' + particular.supplier_reference + '</td><td>' + (particular.in > 0 ? particular.in : "") + '</td><td>' + (particular.out > 0 ? particular.out : "") + '</td><td>' + particular.balance + '</td><td>' + particular.issued_by + '</td></tr>');
                                });
                                $("#ins" + stock.id).text(ins);
                                $("#outs" + stock.id).text(outs);
                            }
                        });
                        requestThisMonth.fail(function(jqXHR, textStatus, errorThrown) {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                        });                        
                    }
                    //-------------------------------------------------------------------------------------------------------------
                    //-------------------------------------------------MONTHLY REPORT----------------------------------------------
                    var monthlyBalances = [];
                    var monthlyBalancesMonths = [];
                    var monthlyIns = [];
                    var monthlyInsMonths = [];
                    var monthlyOuts = [];
                    var monthlyOutsMonths = [];

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
                            $("#monthlyReport" + stock.id).empty().append('<ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#monthlyReportBalance' + stock.id + '">Monthly Balances Report</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#monthlyReportIns' + stock.id + '">Total Ins Per Month</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#monthlyReportOuts' + stock.id + '">Total Outs Per Month</a> </li></ul><div class="tab-content"> <div class="tab-pane fade show active container-fluid" id="monthlyReportBalance' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <canvas id="monthlyBalanceChart' + stock.id + '"></canvas> </div></div></div><div class="tab-pane fade container-fluid" id="monthlyReportIns' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <canvas id="monthlyInsChart' + stock.id + '"></canvas> </div></div></div><div class="tab-pane fade container-fluid" id="monthlyReportOuts' + stock.id + '"> <div class="row m-t-35"> <div class="col-12"> <canvas id="monthlyOutsChart' + stock.id + '"></canvas> </div></div></div></div>');
                            $.each(monthlyBalanceReport, function(i, report) {
                                monthlyBalances.push(parseFloat(report.balance));
                                monthlyBalancesMonths.push(report.month);
                            });
                            let myBalanceChart = document.getElementById("monthlyBalanceChart" + stock.id).getContext('2d');
                            let monthlyBalanceChart = new Chart(myBalanceChart, {
                                type: 'bar',
                                data: {
                                    labels: monthlyBalancesMonths,
                                    datasets: [{
                                        label: "Monthly Balances",
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

                                }
                            });
                        }
                    });
                    requestMonthlyBalanceReport.fail(function(jqXHR, textStatus, errorThrown) {
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
                            type: $thisAddParticularForm.find("input[name='type']").val(),
                            supplier_reference: $thisAddParticularForm.find("input[name='supplier_reference']").val(),
                            in: $thisAddParticularForm.find("input[name='in']").val(),
                            out: $thisAddParticularForm.find("input[name='out']").val(),
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
                        } else if (response === "err") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Error adding particular. Check inputs again.").delay( 5000 ).slideUp(300);
                        }
                    });
                    requestAddParticular.fail(function(jqXHR, textStatus, errorThrown) {
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