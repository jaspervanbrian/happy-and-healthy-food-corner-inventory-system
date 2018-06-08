<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Stock.php';

use App\Models\Stock;

$stock = new Stock();

if (isset($_POST['stock_id'])) {
	$is_recovered = $stock->recover($_POST['stock_id']);
	if ($is_recovered) {
		$_SESSION['recover'] = "ok";
	} else {
		$_SESSION['recover'] = "err";
	}
	header('Location: ../../views/admin/dashboard.php');
}