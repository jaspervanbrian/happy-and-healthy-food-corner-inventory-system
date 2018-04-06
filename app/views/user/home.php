<?php

session_start();
if (isset($_SESSION['user'])) {
	if ($_SESSION['user']['role'] === "admin") {
		header('Location: ../admin/dashboard.php');
	}
} else {
	header('Location: ../../../index.php');
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<title>Dashboard</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
<!--===============================================================================================-->	
	<link rel="icon" type="image/png" href="../../assets/images/happy_n_healthy_logo.jpg"/>
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="../../assets/vendor/bootstrap/css/bootstrap.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="../../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="../../assets/vendor/animate/animate.css">
<!--===============================================================================================-->	
	<link rel="stylesheet" type="text/css" href="../../assets/vendor/css-hamburgers/hamburgers.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="../../assets/vendor/select2/select2.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="../../assets/css/util.css">
	<link rel="stylesheet" type="text/css" href="../../assets/css/main.css">
	<link rel="stylesheet" type="text/css" href="../../assets/css/main2.css">
<!--===============================================================================================-->
</head>
<body class="p-t-110">
	<?php
		include '../navbar.php';
	?>
	<ul class="nav nav-tabs">
		<li class="nav-item">
			<a class="nav-link active" id="inventory-tab" data-toggle="tab" href="#inventory"><h5><span class="fa fa-list"></span> Inventory</h5></a>
		</li>
	</ul>

	<div class="tab-content">
		<div class="tab-pane container fade show active" id="inventory">
			<form action="../../controllers/admin/Inventory.php" method="post" id="searchForm">
				<div class="form-group row p-t-20">
					<label for="searchBy" class="d-flex align-items-center">Search By:</label>
					<div class="col-3">
						<select name="type" id="type" class="form-control">
							<option value="name">Stock name/brand</option>
							<option value="status">Status</option>
							<option value="unit">Unit</option>
						</select>
					</div>
					<div class="col-6">
						<input type="text" class="form-control" name="searchKeyword" id="searchKeyword" placeholder="Enter keyword here...">
					</div>
				</div>
			</form>
			<div class="row">
				<div class="col-12" id="stockList">
					
				</div>
			</div>
			<div class="row">
				<div class="col-12 d-flex justify-content-center" id="pagination">
					
				</div>
			</div>
		</div>
	</div>


  	<div id="flash-message" class="" role="alert" style="z-index: 9999999;"></div>
  	<div id="stockModals"></div>
	<div id="adminModals"></div>
	<div id="userModals"></div>


	<div>
		<div class="modal fade" id="myCredentials" tabindex="-1" role="dialog" aria-labelledby="myCredentialsModal" aria-hidden="true">
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="myCredentialsModal">Edit your credentials</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> 
					</div>
					<div class="modal-body">
						<!-- Nav tabs -->
						<ul class="nav nav-tabs">
							<li class="nav-item">
								<a class="nav-link active" data-toggle="tab" href="#myDetails">Details</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#myPassword">Change Password</a>
							</li>
						</ul>

						<!-- Tab panes -->
						<div class="tab-content">
							<div class="tab-pane active container" id="myDetails">
								<form action="../../controllers/admin/EditUser.php" method="post" id="myDetailsForm">
									<input type="hidden" name="id" value="<?= $_SESSION['user']['id'] ?>"> 
									<div class="row m-t-35">
										<div class="col-12">
											<h3><span class="fa fa-user"></span> User Details</h3>
										</div>
									</div>
									<hr>
									<div class="row">
										<div class="col-6"> 
											<small>Name: </small> 
											<input type="text" name="name" value="<?= $_SESSION['user']['name'] ?>" class="form-control" required> 
										</div>
										<div class="col-6"> 
											<small>Username: </small> 
											<input type="text" name="username" value="<?= $_SESSION['user']['username'] ?>" class="form-control" required> 
										</div>
									</div>
									<div class="row p-t-35">
										<div class="col-6"> 
											<small>Email Address: </small> 
											<input type="email" name="email_address" value="<?= $_SESSION['user']['email_address'] ?>" class="form-control" required> 
										</div>
										<div class="col-6"> 
											<small>Role: </small> 
											<select name="role" class="form-control" required disabled> 
												<option value="user">User</option>
											</select> 
										</div>
									</div>
									<div class="row p-t-35">
										<div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Save changes</button> </div>
									</div>
								</form>
							</div>
							<div class="tab-pane container" id="myPassword">
								<form action="../../controllers/admin/EditPassword.php" id="myPasswordForm" method="post">
									<input type="hidden" name="id" value="<?= $_SESSION['user']['id'] ?>"> 
									<div class="row m-t-35">
										<div class="col-12">
											<h3><span class="fa fa-lock"></span> Change Password</h3>
										</div>
									</div>
									<hr>
									<div class="row">
										<div class="col-3"></div>
										<div class="col-6">
											<small>New Password <span class="text-danger">*</span></small>
											<input type="password" name="password" class="form-control">
										</div>
									</div>
									<div class="row p-t-35">
										<div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-success">Save</button> </div>
									</div>
								</form>
							</div>
						</div>

					</div>
					<div class="modal-footer"> <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button> </div>
				</div>
			</div>
		</div>
	</div>

<!--===============================================================================================-->	
	<script src="../../assets/vendor/jquery/jquery-3.3.1.min.js"></script>
<!--===============================================================================================-->
	<script src="../../assets/vendor/bootstrap/js/popper.js"></script>
	<script src="../../assets/vendor/bootstrap/js/bootstrap.min.js"></script>
<!--===============================================================================================-->
	<script src="../../assets/vendor/select2/select2.min.js"></script>
<!--===============================================================================================-->
	<script src="../../assets/vendor/tilt/tilt.jquery.min.js"></script>
	<script>
		$('.js-tilt').tilt({
			scale: 1.1
		});
	</script>
<!--===============================================================================================-->
	<script src="../../../node_modules/chart.js/dist/Chart.bundle.min.js"></script>
	<script src="../../assets/js/user/inventory.js"></script>
<!--===============================================================================================-->

  	<?php
  		if (isset($_SESSION['update'])) {
  			if ($_SESSION['update'] === "ok") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-success").show().append("Update item successful!").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			} else if ($_SESSION['update'] === "err") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-info").show().append("No changes for item.").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			}
			unset($_SESSION['update']);
  		}
  		if (isset($_SESSION['add'])) {
  			if ($_SESSION['add'] === "ok") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-success").show().append("Add item successful!").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			} else if ($_SESSION['add'] === "err") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-danger").show().append("Error adding desired item.").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			}
			unset($_SESSION['add']);
  		}
  		if (isset($_SESSION['destroy'])) {
  			if ($_SESSION['destroy'] === "ok") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-success").show().append("Delete item successful!").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			} else if ($_SESSION['destroy'] === "err") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-danger").show().append("Error deleting desired item.").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			}
			unset($_SESSION['destroy']);
  		}
  		if (isset($_SESSION['addUser'])) {
  			if ($_SESSION['addUser'] === "ok") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-success").show().append("Add user successful!").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			} else if ($_SESSION['addUser'] === "username") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-warning").show().append("Username already taken.").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			}  else if ($_SESSION['addUser'] === "email") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-warning").show().append("Email address already taken.").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			} else if ($_SESSION['addUser'] === "err") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-danger").show().append("Error adding user.").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			}
			unset($_SESSION['addUser']);
  		}
  	?>
</body>
</html>