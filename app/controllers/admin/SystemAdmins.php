<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/User.php';

use App\Models\User;

$users = new User();

if (isset($_SESSION['user']) && isset($_POST['page'])) {
	echo json_encode($users->systemAdminList($_SESSION['user']['id'], (int)$_POST['page']));
}
