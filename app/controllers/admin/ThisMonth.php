<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Particular.php';

use App\Models\Particular;

$particulars = new Particular();
if (isset($_POST['stock_id']) && isset($_POST['page']) && isset($_POST['type_search']) && isset($_POST['reference_keyword_search'])) {
	echo json_encode($particulars->thisMonthParticular($_POST['stock_id'], $_POST['type_search'], $_POST['reference_keyword_search'], (int)$_POST['page']));
} else {
	echo json_encode($particulars->thisMonthParticular($_POST['stock_id'], $_POST['type_search'], $_POST['reference_keyword_search'], 1));
}
