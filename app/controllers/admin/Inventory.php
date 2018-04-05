<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Stock.php';

use App\Models\Stock;

$stocks = new Stock();
if (isset($_POST['page'])) {
	echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], (int)$_POST['page']));
} else {
	echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], 1));
}
