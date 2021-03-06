<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Supplier.php';

use App\Models\Supplier;

$stocks = new Supplier();
if (isset($_POST['page'])) {
	if (isset($_POST['orderby'])) {
		if (isset($_POST['step'])) {
			echo json_encode($stocks->getSupplier($_POST['type'], $_POST['keyword'], (int)$_POST['page'], $_POST['orderby'], $_POST['step']));
		} else {
			echo json_encode($stocks->getSupplier($_POST['type'], $_POST['keyword'], (int)$_POST['page'], $_POST['orderby'], "ASC"));
		}
	} else {
		if (isset($_POST['step'])) {
			echo json_encode($stocks->getSupplier($_POST['type'], $_POST['keyword'], (int)$_POST['page'], "name", $_POST['step']));
		} else {
			echo json_encode($stocks->getSupplier($_POST['type'], $_POST['keyword'], (int)$_POST['page'], "name", "ASC"));
		}
	}
} else {
	if (isset($_POST['orderby'])) {
		if (isset($_POST['step'])) {
			echo json_encode($stocks->getSupplier($_POST['type'], $_POST['keyword'], 1, $_POST['orderby'], $_POST['step']));
		} else {
			echo json_encode($stocks->getSupplier($_POST['type'], $_POST['keyword'], 1, $_POST['orderby'], "ASC"));
		}
	} else {
		if (isset($_POST['step'])) {
			echo json_encode($stocks->getSupplier($_POST['type'], $_POST['keyword'], 1, "name", $_POST['step']));
		} else {
			echo json_encode($stocks->getSupplier($_POST['type'], $_POST['keyword'], 1, "name", "ASC"));
		}
	}
}
