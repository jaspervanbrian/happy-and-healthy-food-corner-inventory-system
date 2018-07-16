<?php

session_start();

var_dump($_SESSION['user']);

if (isset($_SESSION['user'])) {
	if ($_SESSION['user']['role'] === "admin") {
		header('Location: ../views/admin/dashboard.php');
	} else if ($_SESSION['user']['role'] === "purchasing") {
		header('Location: ../views/purchasing/dashboard.php');
	} else if ($_SESSION['user']['role'] === "delivery") {
		header('Location: ../views/delivery/dashboard.php');
	} else if ($_SESSION['user']['role'] === "systemadmin") {
		header('Location: ../views/systemadmin/dashboard.php');
	}
} else {
	header('Location: ../../index.php');
}