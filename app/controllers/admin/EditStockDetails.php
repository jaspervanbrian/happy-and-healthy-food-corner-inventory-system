<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Stock.php';

use App\Models\Stock;

$stock = new Stock();

if (isset($_POST['stock_id']) && 
	isset($_POST['name']) && 
	isset($_POST['former_name']) && 
	isset($_POST['unit']) && 
	isset($_POST['category']) && 
	isset($_POST['current_qty']) &&
	isset($_POST['low_threshold'])
) {
	$is_updated = $stock->updateDetails($_POST['stock_id'], $_POST['name'], $_POST['former_name'], $_POST['unit'], $_POST['category'], $_POST['current_qty'], $_POST['low_threshold']);
	if ($is_updated === true) {
		echo "ok";
	}
}