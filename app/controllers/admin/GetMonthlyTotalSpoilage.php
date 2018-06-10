<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Particular.php';

use App\Models\Particular;

$particulars = new Particular();
if (isset($_POST['stock_id'])) {
	echo json_encode($particulars->getMonthlyTotalSpoilages($_POST['stock_id']));
}
