<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Stock.php';

use App\Models\Stock;

$stock = new Stock();

if (isset($_POST['stock_id']) && isset($_POST['stock_price'])) {
	$is_updated = $stock->updatePrice($_POST['stock_id'], $_POST['stock_price']);
	if ($is_updated === true) {
		echo "ok";
	}
}