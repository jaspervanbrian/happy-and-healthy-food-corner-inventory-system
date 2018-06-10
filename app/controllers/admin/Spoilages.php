<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Particular.php';

use App\Models\Particular;

$particulars = new Particular();
if (isset($_POST['stock_id']) && isset($_POST['spoilage_reference'])) {
	echo json_encode($particulars->spoilages($_POST['stock_id'], $_POST['spoilage_reference']));
}
