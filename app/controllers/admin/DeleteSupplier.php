<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Supplier.php';

use App\Models\Supplier;

$supplier = new Supplier();

if (isset($_POST['supplier_id'])) {
	$is_deleted = $supplier->destroy($_POST['supplier_id']);
	if ($is_deleted) {
		$_SESSION['destroySupplier'] = "ok";
	} else {
		$_SESSION['destroySupplier'] = "err";
	}
	header('Location: ../../views/systemadmin/dashboard.php');
}