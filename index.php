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
					</div>

					<div class="text-center p-t-70">
					</div>
				</form>
			</div>
		</div>
	</div>
	<div id="flash-message" class="" role="alert"></div>
	
	

	
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