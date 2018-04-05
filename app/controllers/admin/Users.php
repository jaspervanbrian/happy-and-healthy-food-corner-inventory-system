<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/User.php';

use App\Models\User;

$users = new User();

if (isset($_POST['page'])) {
	echo json_encode($users->userList((int)$_POST['page']));
}
