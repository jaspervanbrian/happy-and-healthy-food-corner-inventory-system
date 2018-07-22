<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/Particular.php';

use App\Models\Particular;

$particulars = new Particular();

if(isset($_POST['from_date']) && isset($_POST['to_date'])) {
	echo $particulars->thisMonthParticularPages($_POST['stock_id'], $_POST['type_search'], $_POST['reference_keyword_search'], $_POST['from_date'], $_POST['to_date']);
} else {
	echo $particulars->thisMonthParticularPages($_POST['stock_id'], $_POST['type_search'], $_POST['reference_keyword_search'], "", "");
}
