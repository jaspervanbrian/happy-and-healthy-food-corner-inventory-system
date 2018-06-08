<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Stock.php';

use App\Models\Stock;

$stocks = new Stock();

echo $stocks->getInventoryPages($_POST['type'], $_POST['keyword'], $_POST['is_deleted']);
