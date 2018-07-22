<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Particular.php';

use App\Models\Particular;

$particulars = new Particular();
if (isset($_POST['stock_id']) && isset($_POST['page']) && isset($_POST['type_search']) && isset($_POST['reference_keyword_search'])) {
	if(isset($_POST['from_date']) && isset($_POST['to_date'])) {
		echo json_encode($particulars->thisMonthParticular($_POST['stock_id'], $_POST['type_search'], $_POST['reference_keyword_search'], (int)$_POST['page'], $_POST['from_date'], $_POST['to_date']));
	} else {
		echo json_encode($particulars->thisMonthParticular($_POST['stock_id'], $_POST['type_search'], $_POST['reference_keyword_search'], (int)$_POST['page'], "", ""));
	}
} else {
	if(isset($_POST['from_date']) && isset($_POST['to_date'])) {
		echo json_encode($particulars->thisMonthParticular($_POST['stock_id'], $_POST['type_search'], $_POST['reference_keyword_search'], 1, $_POST['from_date'], $_POST['to_date']));
	} else {
		echo json_encode($particulars->thisMonthParticular($_POST['stock_id'], $_POST['type_search'], $_POST['reference_keyword_search'], 1, "", ""));
	}
}
