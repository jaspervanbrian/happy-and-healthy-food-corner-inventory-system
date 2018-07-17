<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Stock.php';

use App\Models\Stock;

$stock = new Stock();

if (isset($_POST['stock_id']) && isset($_POST['supplier'])) {
	$is_updated = $stock->updateSupplier($_POST['stock_id'], $_POST['supplier']);
	if ($is_updated === true) {
		echo "ok";
	} else {
		echo "err";
	}
}