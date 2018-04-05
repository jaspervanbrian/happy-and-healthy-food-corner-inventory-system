<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Particular.php';

use App\Models\Particular;

$particulars = new Particular();
if (isset($_POST['stock_id']) && isset($_POST['page'])) {
	echo json_encode($particulars->thisMonthParticular($_POST['stock_id'], (int)$_POST['page']));
} else {
	echo json_encode($particulars->thisMonthParticular($_POST['stock_id'], 1));
}
