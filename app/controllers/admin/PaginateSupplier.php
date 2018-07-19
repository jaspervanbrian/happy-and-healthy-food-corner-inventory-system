<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Supplier.php';

use App\Models\Supplier;

$suppliers = new Supplier();

echo $suppliers->getSupplierPages($_POST['type'], $_POST['keyword']);
