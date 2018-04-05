<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Stock.php';

use App\Models\Stock;

$stock = new Stock();

if (isset($_POST['name']) &&
	isset($_POST['unit']) &&
	isset($_POST['current_qty'])
) {
	$is_added = $stock->create($_POST['name'], $_POST['unit'], $_POST['current_qty']);
	if ($is_added) {
		$_SESSION['add'] = "ok";
	} else {
		$_SESSION['add'] = "err";
	}
	header('Location: ../../views/admin/dashboard.php');
}