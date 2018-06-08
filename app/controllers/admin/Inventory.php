<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Stock.php';

use App\Models\Stock;

$stocks = new Stock();
if (isset($_POST['page'])) {
	if (isset($_POST['orderby'])) {
		if (isset($_POST['step'])) {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], (int)$_POST['page'], $_POST['orderby'], $_POST['step'], $_POST['is_deleted']));
		} else {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], (int)$_POST['page'], $_POST['orderby'], "ASC", $_POST['is_deleted']));
		}
	} else {
		if (isset($_POST['step'])) {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], (int)$_POST['page'], "name", $_POST['step'], $_POST['is_deleted']));
		} else {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], (int)$_POST['page'], "name", "ASC", $_POST['is_deleted']));
		}
	}
} else {
	if (isset($_POST['orderby'])) {
		if (isset($_POST['step'])) {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], 1, $_POST['orderby'], $_POST['step'], $_POST['is_deleted']));
		} else {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], 1, $_POST['orderby'], "ASC", $_POST['is_deleted']));
		}
	} else {
		if (isset($_POST['step'])) {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], 1, "name", $_POST['step'], $_POST['is_deleted']));
		} else {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], 1, "name", "ASC", $_POST['is_deleted']));
		}
	}
}
