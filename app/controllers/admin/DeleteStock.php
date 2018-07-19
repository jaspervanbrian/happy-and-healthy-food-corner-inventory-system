<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Stock.php';

use App\Models\Stock;

$stock = new Stock();

if (isset($_POST['stock_id'])) {
	$is_deleted = $stock->destroy($_POST['stock_id']);
	if ($is_deleted) {
		$_SESSION['destroy'] = "ok";
	} else {
		$_SESSION['destroy'] = "err";
	}
	header('Location: ../../views/systemadmin/dashboard.php');
}