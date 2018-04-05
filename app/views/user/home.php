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
	<title>Happy and Healthy</title>
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
<!--===============================================================================================-->
</head>
<body>
	<?php
		include '../navbar.php';
	?>
	<ul class="nav nav-tabs">
		<li class="nav-item">
			<a class="nav-link active" id="maininventory-tab" data-toggle="tab" href="#maininventory">Main Inventory</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="issues-tab" data-toggle="tab" href="#issues">My Issues</a>
		</li>
	</ul>

	<div class="tab-content">
		<div class="tab-pane fade show active container" id="maininventory">
			
		</div>
		<div class="tab-pane fade container-fluid" id="issues">
			
		</div>
	</div>
  	<div id="flash-message" class="" role="alert" style="z-index: 9999999;"></div>
  	<div id="stockModals"></div>
	<div id="returnModals"></div>
	<div id="issueModals"></div>
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
								<form action="../../app/Controllers/Admin/EditUser.php" method="post" id="myDetailsForm">
									<input type="hidden" name="id" value="<?= $_SESSION['user']['id'] ?>"> 
									<div class="row">
										<div class="col-12">
											<h3>User Details</h3>
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
									<div class="row top-margin">
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
									<div class="row top-margin">
										<div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-primary">Save changes</button> </div>
									</div>
								</form>
							</div>
							<div class="tab-pane container" id="myPassword">
								<form action="../../app/Controllers/Admin/EditPassword.php" id="myPasswordForm" method="post">
									<input type="hidden" name="id" value="<?= $_SESSION['user']['id'] ?>"> 
									<div class="row">
										<div class="col-12">
											<h3>Change Password</h3>
										</div>
									</div>
									<hr>
									<div class="row">
										<div class="col-6 offset-3">
											<small>New Password <span class="text-danger">*</span></small>
											<input type="password" name="password" class="form-control">
										</div>
									</div>
									<div class="row top-margin">
										<div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-primary">Save</button> </div>
									</div>
								</form>
							</div>
						</div>

					</div>
					<div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div>
				</div>
			</div>
		</div>
	</div>
  	<?php
  		if (isset($_SESSION['borrow'])) {
  			if ($_SESSION['borrow'] === "ok") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-success").show().append("Borrow successful!").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			} else if ($_SESSION['borrow'] === "err") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-danger").show().append("The item is borrowed or unavailable right now.").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			}
  			unset($_SESSION['borrow']);
  		}
  		if (isset($_SESSION['return'])) {
  			if ($_SESSION['return'] === "ok") {
  	?>
			<script>
				$(document).ready(function() {
					$("#issues-tab").tab('show');
					$("#flash-message").empty().addClass("alert alert-success").show().append("Return successful!").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			} else if ($_SESSION['return'] === "err") {
  	?>
			<script>
				$(document).ready(function() {
					$("#issues-tab").tab('show');
					$("#flash-message").empty().addClass("alert alert-info").show().append("The item is already returned.").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			}
			unset($_SESSION['return']);
  		}
  	?>
  	
<!--===============================================================================================-->	
	<script src="app/assets/vendor/jquery/jquery-3.3.1.min.js"></script>
<!--===============================================================================================-->
	<script src="app/assets/vendor/bootstrap/js/popper.js"></script>
	<script src="app/assets/vendor/bootstrap/js/bootstrap.min.js"></script>
<!--===============================================================================================-->
	<script src="app/assets/vendor/select2/select2.min.js"></script>
<!--===============================================================================================-->
	<script src="app/assets/vendor/tilt/tilt.jquery.min.js"></script>
	<script>
		$('.js-tilt').tilt({
			scale: 1.1
		});
	</script>
<!--===============================================================================================-->
	<script src="app/assets/js/main.js"></script>
<!--===============================================================================================-->
</body>
</html>