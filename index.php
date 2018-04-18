<?php
	session_start();
	if (isset($_SESSION['user'])) {
		if ($_SESSION['user']['role'] === "admin") {
			header('Location: app/views/admin/dashboard.php');
		} else if ($_SESSION['user']['role'] === "user") {
			header('Location: app/views/user/home.php');
		}
	}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>Login</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
<!--===============================================================================================-->	
	<link rel="icon" type="image/png" href="app/assets/images/happy_n_healthy_logo.jpg"/>
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="app/assets/vendor/bootstrap/css/bootstrap.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="app/assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="app/assets/vendor/animate/animate.css">
<!--===============================================================================================-->	
	<link rel="stylesheet" type="text/css" href="app/assets/vendor/css-hamburgers/hamburgers.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="app/assets/vendor/select2/select2.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="app/assets/css/util.css">
	<link rel="stylesheet" type="text/css" href="app/assets/css/main.css">
	<link rel="stylesheet" type="text/css" href="app/assets/css/main2.css">
<!--===============================================================================================-->
</head>
<body>
	
	<div class="limiter">
		<div class="container-login100">
			<div class="wrap-login100">
				<div class="login100-pic js-tilt" data-tilt>
					<img src="app/assets/images/hnh.jpg" alt="IMG">
				</div>

				<form class="login100-form validate-form" method="POST" action="app/controllers/VerifyAccount.php">
					<span class="login100-form-title">
						<h4>Happy N' Healthy Food Corner Corporation</h4>
						<hr>
						<h6 class="text-success">Inventory System</h6>
					</span>

					<div class="wrap-input100 validate-input" data-validate = "Username is required">
						<input class="input100" type="text" name="username" placeholder="Username">
						<span class="focus-input100"></span>
						<span class="symbol-input100">
							<i class="fa fa-user" aria-hidden="true"></i>
						</span>
					</div>

					<div class="wrap-input100 validate-input" data-validate = "Password is required">
						<input class="input100" type="password" name="password" placeholder="Password">
						<span class="focus-input100"></span>
						<span class="symbol-input100">
							<i class="fa fa-lock" aria-hidden="true"></i>
						</span>
					</div>
					
					<div class="container-login100-form-btn">
						<button type="submit" class="login100-form-btn" id="loginBtn">
							Login
						</button>
					</div>

					<div class="text-center p-t-12">
						<span class="txt1">
							Forgot
						</span>
						<a class="txt2" href="#" data-toggle="modal" data-target="#forgotPasswordModal">
							Password?
						</a>
					</div>

					<div class="text-center p-t-70">
					</div>
				</form>
			</div>
		</div>
	</div>
	<div id="flash-message" class="" role="alert"></div>
	
	<div class="modal fade" id="forgotPasswordModal" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="modal-title">Forgot Password</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body" id="forgotPasswordBody">
					<form action="app/controllers/ForgotPasswordUsername.php" method="post" class="validateUsername">
						<div class="row">
							<div class="col-12">
								<h5>
									<span class="text-success"><i class="fa fa-user"></i>&nbsp;Enter Username</span>
									&nbsp;&nbsp;&nbsp;
									<span class="fa fa-caret-right"></span>
									&nbsp;&nbsp;&nbsp;
									<span class="text-secondary"><i class="fa fa-question-circle"></i>&nbsp;Answer Security Question</span>
									&nbsp;&nbsp;&nbsp;
									<span class="fa fa-caret-right"></span>
									&nbsp;&nbsp;&nbsp;
									<span class="text-secondary"><i class="fa fa-lock"></i>&nbsp;Change Password</span>
								</h5>
							</div>
						</div>
						<hr>
						<div class="row">
							<div class="col-12">
								<p>Username:</p>
								<input type="text" name="username" class="form-control" required>
							</div>
						</div>
						<div class="row p-t-35">
							<div class="col-12 d-flex justify-content-center"> 
								<button type="submit" class="btn btn-success">Submit</button> 
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>

	
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
	<script src="app/assets/js/login.js"></script>
<!--===============================================================================================-->

</body>
</html>