<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Supplier.php';

use App\Models\Supplier;

$supplier = new Supplier();

if (isset($_POST['name']) &&
	isset($_POST['location']) &&
	isset($_POST['contact_number'])
) {
	$is_added = $supplier->create($_POST['name'], $_POST['location'], $_POST['contact_number']);
	if ($is_added) {
		$_SESSION['addSupplier'] = "ok";
	} else {
		$_SESSION['addSupplier'] = "err";
	}
	header('Location: ../../views/systemadmin/dashboard.php');
}