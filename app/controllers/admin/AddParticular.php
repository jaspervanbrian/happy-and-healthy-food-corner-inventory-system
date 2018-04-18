<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Particular.php';

use App\Models\Particular;

$particular = new Particular();

if (isset($_POST['stock_id']) &&
	isset($_POST['type']) &&
	isset($_POST['in']) &&
	isset($_POST['out']) &&
	isset($_SESSION['user'])
) {
	$is_added = $particular->create($_POST['stock_id'], $_POST['type'], $_POST['in'], $_POST['out'], $_SESSION['user']['id']);
	if ($is_added === true) {
		echo "ok";
	} else {
		if ($is_added === "qty<out") {
			echo "qty<out";
		} else if ($is_added === false) {
			echo "err";
		}
	}
}