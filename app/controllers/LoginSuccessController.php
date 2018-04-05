<?php

session_start();

var_dump($_SESSION['user']);

if (isset($_SESSION['user'])) {
	if ($_SESSION['user']['role'] === "admin") {
		header('Location: ../views/admin/dashboard.php');
	} else if ($_SESSION['user']['role'] === "user") {
		header('Location: ../views/admin/home.php');
	}
} else {
	header('Location: ../../index.php');
}