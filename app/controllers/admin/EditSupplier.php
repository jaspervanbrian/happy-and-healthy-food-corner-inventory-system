<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Supplier.php';

use App\Models\Supplier;

$supplier = new Supplier();

if (isset($_POST['supplier_id']) &&
	isset($_POST['name']) &&
	isset($_POST['location']) &&
	isset($_POST['contact_number'])
) {
	$is_edited = $supplier->edit($_POST['supplier_id'], $_POST['name'], $_POST['location'], $_POST['contact_number']);
	if ($is_edited) {
		$_SESSION['editSupplier'] = "ok";
	} else {
		$_SESSION['editSupplier'] = "err";
	}
	header('Location: ../../views/systemadmin/dashboard.php');
}