<nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
	<a class="navbar-brand" href="#"><img class="img-fluid" width="70" src="../../assets/images/hnh.jpg" alt="IMG"></a>
	<a class="navbar-brand" href="#">
		<h4>Happy N' Healthy</h4>
		<p class="text-success">Inventory System</p>
	</a>
	<ul class="navbar-nav ml-auto">
		<li class="nav-item dropdown">
			<a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">
				<?php echo htmlspecialchars($_SESSION['user']['username']) ?>
			</a>
			<div class="dropdown-menu dropdown-menu-right">
				<button type="button" data-toggle="modal" data-target="#myCredentials" class="dropdown-item btn btn-success"><span class="fa fa-user"></span> View my profile</button>
				<form action="../../controllers/LogoutController.php" method="post">
					<button type="submit" class="dropdown-item btn btn-success"><span class="fa fa-sign-out"></span> Logout</button>
				</form>
			</div>
		</li>
	</ul>
</nav>