$(document).ready(function() {
	var requestAdmin;
	var requestAdminPages;
	var adminListPage = 1;
	var adminListTotalPages;

    var requestPurchasing;
    var requestPurchasingPages;
    var purchasingListPage = 1;
    var purchasingListTotalPages;

    var requestDelivery;
    var requestDeliveryPages;
    var deliveryListPage = 1;
    var deliveryListTotalPages;

    var requestSystemAdmin;
    var requestSystemAdminPages;
    var systemAdminListPage = 1;
    var systemAdminListTotalPages;

	var adminData = {
		page: adminListPage,
	};

    var purchasingData = {
        page: purchasingListPage,
    };

    var deliveryData = {
        page: deliveryListPage,
    };

    var systemAdminData = {
        page: systemAdminListPage,
    };

	var request;

	getAdminPages();
	getAdmin(adminData);

    getPurchasingPages();
    getPurchasing(purchasingData);

    getDeliveryPages();
    getDelivery(deliveryData);

    getSystemAdminPages();
    getSystemAdmin(systemAdminData);

	$("#adminListPagination").on('click', '.page-item', function() {
        if (!($(this).hasClass("disabled")))
        {
            if ($.trim($(this).text()) === "Previous") {
                if (adminListPage === adminListTotalPages) {
                    $("#adminListPagination").find(':contains("Next")').removeClass('disabled');
                }
                $("#adminListPagination").find(':contains(' + adminListPage + ')').removeClass('active');
                adminListPage -= 1;
                $("#adminListPagination").find(':contains(' + adminListPage + ')').addClass('active');
                adminData = {
                	page: adminListPage,
                };
                getAdmin(adminData);
                if (adminListPage === 1) {
                    $(this).addClass('disabled');
                }
            } else if ($.trim($(this).text()) === "Next") {
                if (adminListPage === 1) {
                    $("#adminListPagination").find(':contains("Previous")').removeClass('disabled');
                }
                $("#adminListPagination").find(':contains(' + adminListPage + ')').removeClass('active');
                adminListPage += 1;
                $("#adminListPagination").find(':contains(' + adminListPage + ')').addClass('active');
                adminData = {
                	page: adminListPage,
                };
                getAdmin(adminData);
                if (adminListPage === adminListTotalPages) {
                    $(this).addClass('disabled');
                }
            } else {
                $("#adminListPagination").find(':contains(' + adminListPage + ')').removeClass('active');
                adminListPage = parseInt($(this).text());
                $("#adminListPagination").find(':contains(' + adminListPage + ')').addClass('active');
                adminData = {
                	page: adminListPage,
                };
                getAdmin(adminData);
                if (adminListPage === 1) {
                    $("#adminListPagination").find(':contains("Previous")').addClass('disabled');
                    $("#adminListPagination").find(':contains("Next")').removeClass('disabled');
                }
                if (adminListPage === adminListTotalPages) {
                    $("#adminListPagination").find(':contains("Previous")').removeClass('disabled');
                    $("#adminListPagination").find(':contains("Next")').addClass('disabled');
                }
            }
        }
    });

    $("#purchasingListPagination").on('click', '.page-item', function() {
        if (!($(this).hasClass("disabled")))
        {
            if ($.trim($(this).text()) === "Previous") {
                if (purchasingListPage === purchasingListTotalPages) {
                    $("#purchasingListPagination").find(':contains("Next")').removeClass('disabled');
                }
                $("#purchasingListPagination").find(':contains(' + purchasingListPage + ')').removeClass('active');
                purchasingListPage -= 1;
                $("#purchasingListPagination").find(':contains(' + purchasingListPage + ')').addClass('active');
                purchasingData = {
                    page: purchasingListPage,
                };
                getPurchasing(purchasingData);
                if (purchasingListPage === 1) {
                    $(this).addClass('disabled');
                }
            } else if ($.trim($(this).text()) === "Next") {
                if (purchasingListPage === 1) {
                    $("#purchasingListPagination").find(':contains("Previous")').removeClass('disabled');
                }
                $("#purchasingListPagination").find(':contains(' + purchasingListPage + ')').removeClass('active');
                purchasingListPage += 1;
                $("#purchasingListPagination").find(':contains(' + purchasingListPage + ')').addClass('active');
                purchasingData = {
                    page: purchasingListPage,
                };
                getPurchasing(purchasingData);
                if (purchasingListPage === purchasingListTotalPages) {
                    $(this).addClass('disabled');
                }
            } else {
                $("#purchasingListPagination").find(':contains(' + purchasingListPage + ')').removeClass('active');
                purchasingListPage = parseInt($(this).text());
                $("#purchasingListPagination").find(':contains(' + purchasingListPage + ')').addClass('active');
                purchasingData = {
                    page: purchasingListPage,
                };
                getPurchasing(purchasingData);
                if (purchasingListPage === 1) {
                    $("#purchasingListPagination").find(':contains("Previous")').addClass('disabled');
                    $("#purchasingListPagination").find(':contains("Next")').removeClass('disabled');
                }
                if (purchasingListPage === purchasingListTotalPages) {
                    $("#purchasingListPagination").find(':contains("Previous")').removeClass('disabled');
                    $("#purchasingListPagination").find(':contains("Next")').addClass('disabled');
                }
            }
        }
    });

    $("#deliveryListPagination").on('click', '.page-item', function() {
        if (!($(this).hasClass("disabled")))
        {
            if ($.trim($(this).text()) === "Previous") {
                if (deliveryListPage === deliveryListTotalPages) {
                    $("#deliveryListPagination").find(':contains("Next")').removeClass('disabled');
                }
                $("#deliveryListPagination").find(':contains(' + deliveryListPage + ')').removeClass('active');
                deliveryListPage -= 1;
                $("#deliveryListPagination").find(':contains(' + deliveryListPage + ')').addClass('active');
                deliveryData = {
                    page: deliveryListPage,
                };
                getDelivery(deliveryData);
                if (deliveryListPage === 1) {
                    $(this).addClass('disabled');
                }
            } else if ($.trim($(this).text()) === "Next") {
                if (deliveryListPage === 1) {
                    $("#deliveryListPagination").find(':contains("Previous")').removeClass('disabled');
                }
                $("#deliveryListPagination").find(':contains(' + deliveryListPage + ')').removeClass('active');
                deliveryListPage += 1;
                $("#deliveryListPagination").find(':contains(' + deliveryListPage + ')').addClass('active');
                deliveryData = {
                    page: deliveryListPage,
                };
                getDelivery(deliveryData);
                if (deliveryListPage === deliveryListTotalPages) {
                    $(this).addClass('disabled');
                }
            } else {
                $("#deliveryListPagination").find(':contains(' + deliveryListPage + ')').removeClass('active');
                deliveryListPage = parseInt($(this).text());
                $("#deliveryListPagination").find(':contains(' + deliveryListPage + ')').addClass('active');
                deliveryData = {
                    page: deliveryListPage,
                };
                getDelivery(deliveryData);
                if (deliveryListPage === 1) {
                    $("#deliveryListPagination").find(':contains("Previous")').addClass('disabled');
                    $("#deliveryListPagination").find(':contains("Next")').removeClass('disabled');
                }
                if (deliveryListPage === deliveryListTotalPages) {
                    $("#deliveryListPagination").find(':contains("Previous")').removeClass('disabled');
                    $("#deliveryListPagination").find(':contains("Next")').addClass('disabled');
                }
            }
        }
    });

    $("#systemAdminListPagination").on('click', '.page-item', function() {
        if (!($(this).hasClass("disabled")))
        {
            if ($.trim($(this).text()) === "Previous") {
                if (systemAdminListPage === systemAdminListTotalPages) {
                    $("#systemAdminListPagination").find(':contains("Next")').removeClass('disabled');
                }
                $("#systemAdminListPagination").find(':contains(' + systemAdminListPage + ')').removeClass('active');
                systemAdminListPage -= 1;
                $("#systemAdminListPagination").find(':contains(' + systemAdminListPage + ')').addClass('active');
                systemAdminData = {
                    page: systemAdminListPage,
                };
                getSystemAdmin(systemAdminData);
                if (systemAdminListPage === 1) {
                    $(this).addClass('disabled');
                }
            } else if ($.trim($(this).text()) === "Next") {
                if (systemAdminListPage === 1) {
                    $("#systemAdminListPagination").find(':contains("Previous")').removeClass('disabled');
                }
                $("#systemAdminListPagination").find(':contains(' + systemAdminListPage + ')').removeClass('active');
                systemAdminListPage += 1;
                $("#systemAdminListPagination").find(':contains(' + systemAdminListPage + ')').addClass('active');
                systemAdminData = {
                    page: systemAdminListPage,
                };
                getSystemAdmin(systemAdminData);
                if (systemAdminListPage === systemAdminListTotalPages) {
                    $(this).addClass('disabled');
                }
            } else {
                $("#systemAdminListPagination").find(':contains(' + systemAdminListPage + ')').removeClass('active');
                systemAdminListPage = parseInt($(this).text());
                $("#systemAdminListPagination").find(':contains(' + systemAdminListPage + ')').addClass('active');
                systemAdminData = {
                    page: systemAdminListPage,
                };
                getSystemAdmin(systemAdminData);
                if (systemAdminListPage === 1) {
                    $("#systemAdminListPagination").find(':contains("Previous")').addClass('disabled');
                    $("#systemAdminListPagination").find(':contains("Next")').removeClass('disabled');
                }
                if (systemAdminListPage === systemAdminListTotalPages) {
                    $("#systemAdminListPagination").find(':contains("Previous")').removeClass('disabled');
                    $("#systemAdminListPagination").find(':contains("Next")').addClass('disabled');
                }
            }
        }
    });

    $("#addUserForm").on('submit', function(e) {
        e.preventDefault();
        if (request) {
            request.abort();
        }
        var $form = $(this);
        var $modal = $(this).closest('.modal');
        request = $.ajax({
            url: $form.attr("action"),
            type: 'POST',
            data: {
                id: $form.find("input[name='id']").val(),
                name: $form.find("input[name='name']").val(),
                username: $form.find("input[name='username']").val(),
                email_address: $form.find("input[name='email_address']").val(),
                role: $form.find("select[name='role']").val(),
                password: $form.find("input[name='password']").val(),
                security_question: $form.find("select[name='security_question']").val(),
                answer: $form.find("input[name='answer']").val(),
            },
        });
        request.done(function(response, textStatus, jqXHR) {
            if (response === "ok") {
                $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Add user successful!").delay( 5000 ).slideUp(300);
                $modal.modal('toggle');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $('body').css('padding-right',0);
                getAdminPages();
                getAdmin(adminData);
                getPurchasingPages();
                getPurchasing(purchasingData);
            } else if (response === "usernameTaken") {
                $("#flash-message").empty().removeClass().addClass("alert alert-warning").show().append("Username already taken.").delay( 5000 ).slideUp(300);    
            } else if (response === "emailTaken") {
                $("#flash-message").empty().removeClass().addClass("alert alert-warning").show().append("Email address already taken.").delay( 5000 ).slideUp(300);   
            } else if (response === "err") {
                $("#flash-message").empty().removeClass().addClass("alert alert-info").show().append("No changes for the user.").delay( 5000 ).slideUp(300);
                $modal.modal('toggle');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $('body').css('padding-right',0);
            }
        });
        request.fail(function(jqXHR, textStatus, errorThrown) {
            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    });
    $("#myDetailsForm").on('submit', function(e) {
        e.preventDefault();
        if (request) {
            request.abort();
        }
        var $form = $(this);
        var $modal = $(this).closest('.modal');
        request = $.ajax({
            url: $form.attr("action"),
            type: 'POST',
            data: {
                id: $form.find("input[name='id']").val(),
                name: $form.find("input[name='name']").val(),
                username: $form.find("input[name='username']").val(),
                email_address: $form.find("input[name='email_address']").val(),
                role: $form.find("select[name='role']").val(),
            },
        });
        request.done(function(response, textStatus, jqXHR) {
            if (response === "ok") {
                $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Add user successful!").delay( 300 ).slideUp(300);
                setTimeout(function() {
                    location.reload();
                }, 800);
            } else if (response === "usernameTaken") {
                $("#flash-message").empty().removeClass().addClass("alert alert-warning").show().append("Username already taken.").delay( 5000 ).slideUp(300);    
            } else if (response === "emailTaken") {
                $("#flash-message").empty().removeClass().addClass("alert alert-warning").show().append("Email address already taken.").delay( 5000 ).slideUp(300);   
            } else if (response === "err") {
                $("#flash-message").empty().removeClass().addClass("alert alert-info").show().append("No changes for the user.").delay( 5000 ).slideUp(300);
                $modal.modal('toggle');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $('body').css('padding-right',0);
            }
        });
        request.fail(function(jqXHR, textStatus, errorThrown) {
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    });

    $("#myPasswordForm").on('submit', function(e) {
        e.preventDefault();
        if (request) {
            request.abort();
        }
        var $form = $(this);
        var $modal = $(this).closest('.modal');
        request = $.ajax({
            url: $form.attr("action"),
            type: 'POST',
            data: {
                id: $form.find("input[name='id']").val(),
                currentPassword: $form.find("input[name='currentPassword']").val(),
                password: $form.find("input[name='password']").val(),
                confirm_password: $form.find("input[name='confirm_password']").val(),
            },
        });
        request.done(function(response, textStatus, jqXHR) {
            if (response === "ok") {
                $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Update user password successful!").delay( 5000 ).slideUp(300);
                $form.find("input[name='currentPassword']").val("");
                $form.find("input[name='password']").val("");
                $form.find("input[name='confirm_password']").val("");
                $modal.modal('toggle');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $('body').css('padding-right',0);
            } else if (response === "err") {
                $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Error changing password. Wrong current password.").delay( 5000 ).slideUp(300);
            } else if (response === "confirm") {
                $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Error changing password. Wrong confirmation password.").delay( 5000 ).slideUp(300);
            }
        });
        request.fail(function(jqXHR, textStatus, errorThrown) {
            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    });

	function getAdminPages() {
		if (requestAdminPages) {
			requestAdminPages.abort();
		}
		requestAdminPages = $.ajax({
			url: '../../controllers/admin/PaginateAdminList.php',
			type: 'POST',
		});
		requestAdminPages.done(function(response, textStatus, jqXHR) {
			if (parseInt(response) > 8) {
                $("#adminListPagination").empty().append('<ul class="pagination"></ul>');
                var $adminListPagination = $("#adminListPagination").find('.pagination');
                $adminListPagination.append('<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>');
                adminListTotalPages = Math.ceil((parseInt(response)/8));
                for (var i = 1; i <= adminListTotalPages; i++) {
                    if (i === 1) {
                        $adminListPagination.append('<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>');
                    } else {
                        $adminListPagination.append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
                    }
                }
                $adminListPagination.append('<li class="page-item"><a class="page-link" href="#">Next</a></li>');
            } else {
                $("#adminListPagination").empty();
            }
        })
        requestAdminPages.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
	}
	function getAdmin(adminData) {
		if (requestAdmin) {
			requestAdmin.abort();
		}
		requestAdmin = $.ajax({
			url: '../../controllers/admin/Admins.php',
			type: 'POST',
            data: adminData,
		});
		requestAdmin.done(function(response, textStatus, jqXHR) {
			var adminList = JSON.parse(response);
			if (adminList.length === 0) {
				$("#adminList").empty().append('<div class="alert alert-info">There are no admins yet.</div>');
				$("#adminModals").empty();
			} else {
				$("#adminModals").empty();
				$("#adminList").empty().append('<table class="table table-hover"><thead class="thead-dark"><tr><th>Name</th><th>Username</th><th>Email address</th></tr></thead><tbody></tbody></table>');
				$adminListBody = $("#adminList").find('tbody');
				$.each(adminList, function(i, admin) {
					$adminListBody.append('<tr data-toggle="modal" data-target="#admin' + admin.id + '"><td>' + admin.name + '</td><td>' + admin.username + '</td><td>' + admin.email_address + '</td></tr>');
					$("#adminModals").append('<div class="modal fade" id="admin' + admin.id + '" tabindex="-1" role="dialog" aria-labelledby="adminModal' + admin.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="adminModal' + admin.id + '">Edit Admin</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body"> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#adminDetail' + admin.id + '">Details</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#adminPassword' + admin.id + '">Change Password</a> </li></ul> <div class="tab-content"> <div class="tab-pane active container" id="adminDetail' + admin.id + '"> <form action="../../controllers/admin/EditUser.php" method="post" class="editAdmin"> <input type="hidden" name="id" value="' + admin.id + '"> <div class="row"> <div class="col-12"> <h3 class="p-t-35"><span class="fa fa-user"></span> User Details</h3> </div></div><hr> <div class="row"> <div class="col-6"> <small>Name: </small> <input type="text" name="name" value="' + admin.name + '" class="form-control" required> </div><div class="col-6"> <small>Username: </small> <input type="text" name="username" value="' + admin.username + '" class="form-control" required> </div></div><div class="row p-t-35"> <div class="col-6"> <small>Email Address: </small> <input type="email" name="email_address" value="' + admin.email_address + '" class="form-control" required> </div><div class="col-6"> <small>Role: </small> <select name="role" class="form-control" required ' + (admin.role==="me" ? "disabled" : "") + '> <option value="admin" ' + (admin.role==="admin" ? "selected" : "") + '>Admin</option> <option value="purchasing" ' + (admin.role==="purchasing" ? "selected" : "") + '>Purchasing</option> <option value="delivery" ' + (admin.role==="delivery" ? "selected" : "") + '>Delivery</option> <option value="systemadmin" ' + (admin.role==="systemadmin" ? "selected" : "") + '>System Admin</option> </select> </div></div><div class="row p-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Save changes</button> </div></div></form> </div><div class="tab-pane container" id="adminPassword' + admin.id + '"> <form action="../../controllers/admin/EditPassword.php" class="editAdminPassword" method="post"> <input type="hidden" name="id" value="' + admin.id + '"> <div class="row"> <div class="col-12"> <h3 class="p-t-35"> <h3><span class="fa fa-lock"></span> Change Password</h3> </div></div><hr> <div class="row"> <div class="col-3"></div><div class="col-6"> <small>Current Password <span class="text-danger">*</span></small> <input type="password" name="currentPassword" class="form-control" required> </div></div><div class="row"> <div class="col-3"></div><div class="col-6"> <small>New Password <span class="text-danger">*</span></small> <input type="password" name="password" class="form-control" required> </div></div><div class="row"> <div class="col-3"></div><div class="col-6"> <small>Confirm New Password <span class="text-danger">*</span></small> <input type="password" name="confirm_password" class="form-control" required> </div></div><div class="row p-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Save</button> </div></div></form> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button> </div></div></div></div>');
				});
				$(".editAdmin").on('submit', function(e) {
					e.preventDefault();
					if (request) {
						request.abort();
					}
					var $form = $(this);
					var $modal = $(this).closest('.modal');
					request = $.ajax({
						url: $form.attr("action"),
						type: 'POST',
						data: {
							id: $form.find("input[name='id']").val(),
							name: $form.find("input[name='name']").val(),
							username: $form.find("input[name='username']").val(),
							email_address: $form.find("input[name='email_address']").val(),
							role: $form.find("select[name='role']").val(),
						},
					});
					request.done(function(response, textStatus, jqXHR) {
						if (response === "ok") {
							$("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Update user successful!").delay( 5000 ).slideUp(300);
							$modal.modal('toggle');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
							$('body').css('padding-right',0);
							getAdmin(adminData);
						} else if (response === "usernameTaken") {
							$("#flash-message").empty().removeClass().addClass("alert alert-warning").show().append("Username already taken.").delay( 5000 ).slideUp(300);	
						} else if (response === "emailTaken") {
							$("#flash-message").empty().removeClass().addClass("alert alert-warning").show().append("Email address already taken.").delay( 5000 ).slideUp(300);	
						} else if (response === "err") {
							$("#flash-message").empty().removeClass().addClass("alert alert-info").show().append("No changes for the user.").delay( 5000 ).slideUp(300);
							$modal.modal('toggle');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
							$('body').css('padding-right',0);
						}
					});
					request.fail(function(jqXHR, textStatus, errorThrown) {
						$("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
					});
				});
                $(".editAdminPassword").on('submit', function(e) {
                    e.preventDefault();
                    if (request) {
                        request.abort();
                    }
                    var $form = $(this);
                    var $modal = $(this).closest('.modal');
                    request = $.ajax({
                        url: $form.attr("action"),
                        type: 'POST',
                        data: {
                            id: $form.find("input[name='id']").val(),
                            currentPassword: $form.find("input[name='currentPassword']").val(),
                            password: $form.find("input[name='password']").val(),
                            confirm_password: $form.find("input[name='confirm_password']").val(),
                        },
                    });
                    request.done(function(response, textStatus, jqXHR) {
                        if (response === "ok") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Update user password successful!").delay( 5000 ).slideUp(300);
                            $form.find("input[name='currentPassword']").val("");
                            $form.find("input[name='password']").val("");
                            $form.find("input[name='confirm_password']").val("");
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                            getAdmin(adminData);
                        } else if (response === "err") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Error changing password. Wrong current password.").delay( 5000 ).slideUp(300);
                        } else if (response === "confirm") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Error changing password. Wrong confirmation password.").delay( 5000 ).slideUp(300);
                        }
                    });
                    request.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                });
			}
		});
		requestAdmin.fail(function(jqXHR, textStatus, errorThrown) {
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
		});
	}
	function getPurchasingPages() 
	{
        if(requestPurchasingPages){
            requestPurchasingPages.abort();
        }
        requestPurchasingPages = $.ajax({
            url: '../../controllers/admin/PaginatePurchasingList.php',
            type: 'POST',
        });
        requestPurchasingPages.done(function(response, textStatus, jqXHR) {
            if (parseInt(response) > 8) {
                $("#purchasingListPagination").empty().append('<ul class="pagination"></ul>');
                var $purchasingListPagination = $("#purchasingListPagination").find('.pagination');
                $purchasingListPagination.append('<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>');
                purchasingListTotalPages = Math.ceil((parseInt(response)/8));
                for (var i = 1; i <= purchasingListTotalPages; i++) {
                    if (i === 1) {
                        $purchasingListPagination.append('<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>');
                    } else {
                        $purchasingListPagination.append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
                    }
                }
                $purchasingListPagination.append('<li class="page-item"><a class="page-link" href="#">Next</a></li>');
            } else {
                $("#purchasingListPagination").empty();
            }
        })
        requestPurchasingPages.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    }
	function getPurchasing(purchasingData) 
	{
		if(requestPurchasing){
            requestPurchasing.abort();
        }
        requestPurchasing = $.ajax({
        	url: '../../controllers/admin/Purchasing.php',
        	type: 'POST',
        	data: purchasingData,
        });
        requestPurchasing.done(function(response, textStatus, jqXHR) {
        	var purchasingList = JSON.parse(response);
			if (purchasingList.length === 0) {
				$("#purchasingList").empty().append('<div class="alert alert-info">There are no purchasing users yet.</div>');
				$("#purchasingModals").empty();
			} else {
				$("#purchasingModals").empty();
				$("#purchasingList").empty().append('<table class="table table-hover"><thead class="thead-dark"><tr><th>Name</th><th>Username</th><th>Email address</th></tr></thead><tbody></tbody></table>');
				$purchasingListBody = $("#purchasingList").find('tbody');
				$.each(purchasingList, function(i, purchasing) {
					$purchasingListBody.append('<tr data-toggle="modal" data-target="#purchasing' + purchasing.id + '"><td>' + purchasing.name + '</td><td>' + purchasing.username + '</td><td>' + purchasing.email_address + '</td></tr>');
					$("#purchasingModals").append('<div class="modal fade" id="purchasing' + purchasing.id + '" tabindex="-1" role="dialog" aria-labelledby="userModal' + purchasing.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="userModal' + purchasing.id + '">Edit Purchasing</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body"> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#purchasingDetail' + purchasing.id + '">Details</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#purchasingPassword' + purchasing.id + '">Change Password</a> </li></ul> <div class="tab-content"> <div class="tab-pane active container" id="purchasingDetail' + purchasing.id + '"> <form action="../../controllers/admin/EditUser.php" method="post" class="editPurchasing"> <input type="hidden" name="id" value="' + purchasing.id + '"> <div class="row"> <div class="col-12"> <h3 class="p-t-35"><span class="fa fa-user"></span> Purchasing Details</h3> </div></div><hr> <div class="row"> <div class="col-6"> <small>Name: </small> <input type="text" name="name" value="' + purchasing.name + '" class="form-control" required> </div><div class="col-6"> <small>Username: </small> <input type="text" name="username" value="' + purchasing.username + '" class="form-control" required> </div></div><div class="row p-t-35"> <div class="col-6"> <small>Email Address: </small> <input type="email" name="email_address" value="' + purchasing.email_address + '" class="form-control" required> </div><div class="col-6"> <small>Role: </small> <select name="role" class="form-control" required ' + (purchasing.role==="me" ? "disabled" : "") + '> <option value="admin" ' + (purchasing.role==="admin" ? "selected" : "") + '>Admin</option> <option value="purchasing" ' + (purchasing.role==="purchasing" ? "selected" : "") + '>Purchasing</option> <option value="delivery" ' + (purchasing.role==="delivery" ? "selected" : "") + '>Delivery</option> <option value="systemadmin" ' + (purchasing.role==="systemadmin" ? "selected" : "") + '>System Admin</option> </select> </div></div><div class="row p-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Save changes</button> </div></div></form> </div><div class="tab-pane container" id="purchasingPassword' + purchasing.id + '"> <form action="../../controllers/admin/EditPassword.php" class="editPurchasingPassword" method="post"> <input type="hidden" name="id" value="' + purchasing.id + '"> <div class="row"> <div class="col-12"> <h3 class="p-t-35"> <h3><span class="fa fa-lock"></span> Change Password</h3> </div></div><hr> <div class="row"> <div class="col-3"></div><div class="col-6"> <small>Current Password <span class="text-danger">*</span></small> <input type="password" name="currentPassword" class="form-control" required> </div></div><div class="row"> <div class="col-3"></div><div class="col-6"> <small>New Password <span class="text-danger">*</span></small> <input type="password" name="password" class="form-control" required> </div></div><div class="row"> <div class="col-3"></div><div class="col-6"> <small>Confirm New Password <span class="text-danger">*</span></small> <input type="password" name="confirm_password" class="form-control" required> </div></div><div class="row p-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Save</button> </div></div></form> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button> </div></div></div></div>');
				});
				$(".editPurchasing").on('submit', function(e) {
					e.preventDefault();
					if (request) {
						request.abort();
					}
					var $form = $(this);
					var $modal = $(this).closest('.modal');
					request = $.ajax({
						url: $form.attr("action"),
						type: 'POST',
						data: {
							id: $form.find("input[name='id']").val(),
							name: $form.find("input[name='name']").val(),
							username: $form.find("input[name='username']").val(),
							email_address: $form.find("input[name='email_address']").val(),
							role: $form.find("select[name='role']").val(),
						},
					});
					request.done(function(response, textStatus, jqXHR) {
						if (response === "ok") {
							$("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Update user successful!").delay( 5000 ).slideUp(300);
							$modal.modal('toggle');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
							$('body').css('padding-right',0);
							getPurchasing(purchasingData);
						} else if (response === "usernameTaken") {
							$("#flash-message").empty().removeClass().addClass("alert alert-warning").show().append("Username already taken.").delay( 5000 ).slideUp(300);	
						} else if (response === "emailTaken") {
							$("#flash-message").empty().removeClass().addClass("alert alert-warning").show().append("Email address already taken.").delay( 5000 ).slideUp(300);	
						} else if (response === "err") {
							$("#flash-message").empty().removeClass().addClass("alert alert-info").show().append("No changes for the user.").delay( 5000 ).slideUp(300);
							$modal.modal('toggle');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
							$('body').css('padding-right',0);
						}
					});
					request.fail(function(jqXHR, textStatus, errorThrown) {
						$("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
					});
				});
                $(".editPurchasingPassword").on('submit', function(e) {
                    e.preventDefault();
                    if (request) {
                        request.abort();
                    }
                    var $form = $(this);
                    var $modal = $(this).closest('.modal');
                    request = $.ajax({
                        url: $form.attr("action"),
                        type: 'POST',
                        data: {
                            id: $form.find("input[name='id']").val(),
                            currentPassword: $form.find("input[name='currentPassword']").val(),
                            password: $form.find("input[name='password']").val(),
                            confirm_password: $form.find("input[name='confirm_password']").val(),
                        },
                    });
                    request.done(function(response, textStatus, jqXHR) {
                        if (response === "ok") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Update purchasing user password successful!").delay( 5000 ).slideUp(300);
                            $form.find("input[name='currentPassword']").val("");
                            $form.find("input[name='password']").val("");
                            $form.find("input[name='confirm_password']").val("");
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                            getPurchasing(purchasingData);
                        } else if (response === "err") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Error changing password. Wrong current password.").delay( 5000 ).slideUp(300);
                        } else if (response === "confirm") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Error changing password. Wrong confirmation password.").delay( 5000 ).slideUp(300);
                        }
                    });
                    request.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                });
			}
        });
        requestPurchasing.fail(function(jqXHR, textStatus, errorThrown) {
        	$("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
	}

    function getDeliveryPages() 
    {
        if(requestDeliveryPages){
            requestDeliveryPages.abort();
        }
        requestDeliveryPages = $.ajax({
            url: '../../controllers/admin/PaginateDeliveryList.php',
            type: 'POST',
        });
        requestDeliveryPages.done(function(response, textStatus, jqXHR) {
            if (parseInt(response) > 8) {
                $("#deliveryListPagination").empty().append('<ul class="pagination"></ul>');
                var $deliveryListPagination = $("#deliveryListPagination").find('.pagination');
                $deliveryListPagination.append('<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>');
                deliveryListTotalPages = Math.ceil((parseInt(response)/8));
                for (var i = 1; i <= deliveryListTotalPages; i++) {
                    if (i === 1) {
                        $deliveryListPagination.append('<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>');
                    } else {
                        $deliveryListPagination.append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
                    }
                }
                $deliveryListPagination.append('<li class="page-item"><a class="page-link" href="#">Next</a></li>');
            } else {
                $("#deliveryListPagination").empty();
            }
        })
        requestDeliveryPages.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    }
    function getDelivery(deliveryData) 
    {
        if(requestDelivery){
            requestDelivery.abort();
        }
        requestDelivery = $.ajax({
            url: '../../controllers/admin/Delivery.php',
            type: 'POST',
            data: deliveryData,
        });
        requestDelivery.done(function(response, textStatus, jqXHR) {
            var deliveryList = JSON.parse(response);
            if (deliveryList.length === 0) {
                $("#deliveryList").empty().append('<div class="alert alert-info">There are no delivery users yet.</div>');
                $("#deliveryModals").empty();
            } else {
                $("#deliveryModals").empty();
                $("#deliveryList").empty().append('<table class="table table-hover"><thead class="thead-dark"><tr><th>Name</th><th>Username</th><th>Email address</th></tr></thead><tbody></tbody></table>');
                $deliveryListBody = $("#deliveryList").find('tbody');
                $.each(deliveryList, function(i, delivery) {
                    $deliveryListBody.append('<tr data-toggle="modal" data-target="#delivery' + delivery.id + '"><td>' + delivery.name + '</td><td>' + delivery.username + '</td><td>' + delivery.email_address + '</td></tr>');
                    $("#deliveryModals").append('<div class="modal fade" id="delivery' + delivery.id + '" tabindex="-1" role="dialog" aria-labelledby="userModal' + delivery.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="userModal' + delivery.id + '">Edit Delivery</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body"> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#deliveryDetail' + delivery.id + '">Details</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#deliveryPassword' + delivery.id + '">Change Password</a> </li></ul> <div class="tab-content"> <div class="tab-pane active container" id="deliveryDetail' + delivery.id + '"> <form action="../../controllers/admin/EditUser.php" method="post" class="editDelivery"> <input type="hidden" name="id" value="' + delivery.id + '"> <div class="row"> <div class="col-12"> <h3 class="p-t-35"><span class="fa fa-user"></span> Delivery Details</h3> </div></div><hr> <div class="row"> <div class="col-6"> <small>Name: </small> <input type="text" name="name" value="' + delivery.name + '" class="form-control" required> </div><div class="col-6"> <small>Username: </small> <input type="text" name="username" value="' + delivery.username + '" class="form-control" required> </div></div><div class="row p-t-35"> <div class="col-6"> <small>Email Address: </small> <input type="email" name="email_address" value="' + delivery.email_address + '" class="form-control" required> </div><div class="col-6"> <small>Role: </small> <select name="role" class="form-control" required ' + (delivery.role==="me" ? "disabled" : "") + '> <option value="admin" ' + (delivery.role==="admin" ? "selected" : "") + '>Admin</option> <option value="delivery" ' + (delivery.role==="purchasing" ? "selected" : "") + '>Purchasing</option> <option value="delivery" ' + (delivery.role==="delivery" ? "selected" : "") + '>Delivery</option> <option value="systemadmin" ' + (delivery.role==="systemadmin" ? "selected" : "") + '>System Admin</option> </select> </div></div><div class="row p-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Save changes</button> </div></div></form> </div><div class="tab-pane container" id="deliveryPassword' + delivery.id + '"> <form action="../../controllers/admin/EditPassword.php" class="editDeliveryPassword" method="post"> <input type="hidden" name="id" value="' + delivery.id + '"> <div class="row"> <div class="col-12"> <h3 class="p-t-35"> <h3><span class="fa fa-lock"></span> Change Password</h3> </div></div><hr> <div class="row"> <div class="col-3"></div><div class="col-6"> <small>Current Password <span class="text-danger">*</span></small> <input type="password" name="currentPassword" class="form-control" required> </div></div><div class="row"> <div class="col-3"></div><div class="col-6"> <small>New Password <span class="text-danger">*</span></small> <input type="password" name="password" class="form-control" required> </div></div><div class="row"> <div class="col-3"></div><div class="col-6"> <small>Confirm New Password <span class="text-danger">*</span></small> <input type="password" name="confirm_password" class="form-control" required> </div></div><div class="row p-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Save</button> </div></div></form> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button> </div></div></div></div>');
                });
                $(".editDelivery").on('submit', function(e) {
                    e.preventDefault();
                    if (request) {
                        request.abort();
                    }
                    var $form = $(this);
                    var $modal = $(this).closest('.modal');
                    request = $.ajax({
                        url: $form.attr("action"),
                        type: 'POST',
                        data: {
                            id: $form.find("input[name='id']").val(),
                            name: $form.find("input[name='name']").val(),
                            username: $form.find("input[name='username']").val(),
                            email_address: $form.find("input[name='email_address']").val(),
                            role: $form.find("select[name='role']").val(),
                        },
                    });
                    request.done(function(response, textStatus, jqXHR) {
                        if (response === "ok") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Update user successful!").delay( 5000 ).slideUp(300);
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                            getDelivery(deliveryData);
                        } else if (response === "usernameTaken") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-warning").show().append("Username already taken.").delay( 5000 ).slideUp(300);  
                        } else if (response === "emailTaken") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-warning").show().append("Email address already taken.").delay( 5000 ).slideUp(300); 
                        } else if (response === "err") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-info").show().append("No changes for the user.").delay( 5000 ).slideUp(300);
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                        }
                    });
                    request.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                });
                $(".editDeliveryPassword").on('submit', function(e) {
                    e.preventDefault();
                    if (request) {
                        request.abort();
                    }
                    var $form = $(this);
                    var $modal = $(this).closest('.modal');
                    request = $.ajax({
                        url: $form.attr("action"),
                        type: 'POST',
                        data: {
                            id: $form.find("input[name='id']").val(),
                            currentPassword: $form.find("input[name='currentPassword']").val(),
                            password: $form.find("input[name='password']").val(),
                            confirm_password: $form.find("input[name='confirm_password']").val(),
                        },
                    });
                    request.done(function(response, textStatus, jqXHR) {
                        if (response === "ok") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Update delivery user password successful!").delay( 5000 ).slideUp(300);
                            $form.find("input[name='currentPassword']").val("");
                            $form.find("input[name='password']").val("");
                            $form.find("input[name='confirm_password']").val("");
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                            getDelivery(deliveryData);
                        } else if (response === "err") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Error changing password. Wrong current password.").delay( 5000 ).slideUp(300);
                        } else if (response === "confirm") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Error changing password. Wrong confirmation password.").delay( 5000 ).slideUp(300);
                        }
                    });
                    request.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                });
            }
        });
        requestDelivery.fail(function(jqXHR, textStatus, errorThrown) {
            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    }

    function getSystemAdminPages() 
    {
        if(requestSystemAdminPages){
            requestSystemAdminPages.abort();
        }
        requestSystemAdminPages = $.ajax({
            url: '../../controllers/admin/PaginateSystemAdminList.php',
            type: 'POST',
        });
        requestSystemAdminPages.done(function(response, textStatus, jqXHR) {
            if (parseInt(response) > 8) {
                $("#systemAdminListPagination").empty().append('<ul class="pagination"></ul>');
                var $systemAdminListPagination = $("#systemAdminListPagination").find('.pagination');
                $systemAdminListPagination.append('<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>');
                systemAdminListTotalPages = Math.ceil((parseInt(response)/8));
                for (var i = 1; i <= systemAdminListTotalPages; i++) {
                    if (i === 1) {
                        $systemAdminListPagination.append('<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>');
                    } else {
                        $systemAdminListPagination.append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
                    }
                }
                $systemAdminListPagination.append('<li class="page-item"><a class="page-link" href="#">Next</a></li>');
            } else {
                $("#systemAdminListPagination").empty();
            }
        })
        requestSystemAdminPages.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    }
    function getSystemAdmin(systemAdminData) 
    {
        if(requestSystemAdmin){
            requestSystemAdmin.abort();
        }
        requestSystemAdmin = $.ajax({
            url: '../../controllers/admin/SystemAdmins.php',
            type: 'POST',
            data: systemAdminData,
        });
        requestSystemAdmin.done(function(response, textStatus, jqXHR) {
            var systemAdminList = JSON.parse(response);
            if (systemAdminList.length === 0) {
                $("#systemAdminList").empty().append('<div class="alert alert-info">There are no system admins yet.</div>');
                $("#systemAdminModals").empty();
            } else {
                $("#systemAdminModals").empty();
                $("#systemAdminList").empty().append('<table class="table table-hover"><thead class="thead-dark"><tr><th>Name</th><th>Username</th><th>Email address</th></tr></thead><tbody></tbody></table>');
                $systemAdminListBody = $("#systemAdminList").find('tbody');
                $.each(systemAdminList, function(i, systemAdmin) {
                    $systemAdminListBody.append('<tr data-toggle="modal" data-target="#systemAdmin' + systemAdmin.id + '"><td>' + systemAdmin.name + '</td><td>' + systemAdmin.username + '</td><td>' + systemAdmin.email_address + '</td></tr>');
                    $("#systemAdminModals").append('<div class="modal fade" id="systemAdmin' + systemAdmin.id + '" tabindex="-1" role="dialog" aria-labelledby="userModal' + systemAdmin.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="userModal' + systemAdmin.id + '">Edit System Admin</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body"> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#systemAdminDetail' + systemAdmin.id + '">Details</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#systemAdminPassword' + systemAdmin.id + '">Change Password</a> </li></ul> <div class="tab-content"> <div class="tab-pane active container" id="systemAdminDetail' + systemAdmin.id + '"> <form action="../../controllers/admin/EditUser.php" method="post" class="editSystemAdmin"> <input type="hidden" name="id" value="' + systemAdmin.id + '"> <div class="row"> <div class="col-12"> <h3 class="p-t-35"><span class="fa fa-user"></span> System Admin Details</h3> </div></div><hr> <div class="row"> <div class="col-6"> <small>Name: </small> <input type="text" name="name" value="' + systemAdmin.name + '" class="form-control" required> </div><div class="col-6"> <small>Username: </small> <input type="text" name="username" value="' + systemAdmin.username + '" class="form-control" required> </div></div><div class="row p-t-35"> <div class="col-6"> <small>Email Address: </small> <input type="email" name="email_address" value="' + systemAdmin.email_address + '" class="form-control" required> </div><div class="col-6"> <small>Role: </small> <select name="role" class="form-control" required ' + (systemAdmin.role==="me" ? "disabled" : "") + '> <option value="admin" ' + (systemAdmin.role==="admin" ? "selected" : "") + '>Admin</option> <option value="systemAdmin" ' + (systemAdmin.role==="purchasing" ? "selected" : "") + '>Purchasing</option> <option value="systemAdmin" ' + (systemAdmin.role==="delivery" ? "selected" : "") + '>Delivery</option> <option value="systemadmin" ' + (systemAdmin.role==="systemadmin" || systemAdmin.role==="me" ? "selected" : "") + '>System Admin</option> </select> </div></div><div class="row p-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Save changes</button> </div></div></form> </div><div class="tab-pane container" id="systemAdminPassword' + systemAdmin.id + '"> <form action="../../controllers/admin/EditPassword.php" class="editSystemAdminPassword" method="post"> <input type="hidden" name="id" value="' + systemAdmin.id + '"> <div class="row"> <div class="col-12"> <h3 class="p-t-35"> <h3><span class="fa fa-lock"></span> Change Password</h3> </div></div><hr> <div class="row"> <div class="col-3"></div><div class="col-6"> <small>Current Password <span class="text-danger">*</span></small> <input type="password" name="currentPassword" class="form-control" required> </div></div><div class="row"> <div class="col-3"></div><div class="col-6"> <small>New Password <span class="text-danger">*</span></small> <input type="password" name="password" class="form-control" required> </div></div><div class="row"> <div class="col-3"></div><div class="col-6"> <small>Confirm New Password <span class="text-danger">*</span></small> <input type="password" name="confirm_password" class="form-control" required> </div></div><div class="row p-t-35"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Save</button> </div></div></form> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button> </div></div></div></div>');
                });
                $(".editSystemAdmin").on('submit', function(e) {
                    e.preventDefault();
                    if (request) {
                        request.abort();
                    }
                    var $form = $(this);
                    var $modal = $(this).closest('.modal');
                    request = $.ajax({
                        url: $form.attr("action"),
                        type: 'POST',
                        data: {
                            id: $form.find("input[name='id']").val(),
                            name: $form.find("input[name='name']").val(),
                            username: $form.find("input[name='username']").val(),
                            email_address: $form.find("input[name='email_address']").val(),
                            role: $form.find("select[name='role']").val(),
                        },
                    });
                    request.done(function(response, textStatus, jqXHR) {
                        if (response === "ok") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Update user successful!").delay( 5000 ).slideUp(300);
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                            getSystemAdmin(systemAdminData);
                        } else if (response === "usernameTaken") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-warning").show().append("Username already taken.").delay( 5000 ).slideUp(300);  
                        } else if (response === "emailTaken") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-warning").show().append("Email address already taken.").delay( 5000 ).slideUp(300); 
                        } else if (response === "err") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-info").show().append("No changes for the user.").delay( 5000 ).slideUp(300);
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                        }
                    });
                    request.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                });
                $(".editSystemAdminPassword").on('submit', function(e) {
                    e.preventDefault();
                    if (request) {
                        request.abort();
                    }
                    var $form = $(this);
                    var $modal = $(this).closest('.modal');
                    request = $.ajax({
                        url: $form.attr("action"),
                        type: 'POST',
                        data: {
                            id: $form.find("input[name='id']").val(),
                            currentPassword: $form.find("input[name='currentPassword']").val(),
                            password: $form.find("input[name='password']").val(),
                            confirm_password: $form.find("input[name='confirm_password']").val(),
                        },
                    });
                    request.done(function(response, textStatus, jqXHR) {
                        if (response === "ok") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-success").show().append("Update systemAdmin user password successful!").delay( 5000 ).slideUp(300);
                            $form.find("input[name='currentPassword']").val("");
                            $form.find("input[name='password']").val("");
                            $form.find("input[name='confirm_password']").val("");
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                            getSystemAdmin(systemAdminData);
                        } else if (response === "err") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Error changing password. Wrong current password.").delay( 5000 ).slideUp(300);
                        } else if (response === "confirm") {
                            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append("Error changing password. Wrong confirmation password.").delay( 5000 ).slideUp(300);
                        }
                    });
                    request.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                });
            }
        });
        requestSystemAdmin.fail(function(jqXHR, textStatus, errorThrown) {
            $("#flash-message").empty().removeClass().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    }
});