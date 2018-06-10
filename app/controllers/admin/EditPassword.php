<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/User.php';

use App\Models\User;

$user = new User();

if (isset($_SESSION['user']['id']) && isset($_POST['currentPassword']) && isset($_POST['password'])) {
	$is_updated = $user->updatePassword($_SESSION['user']['id'], $_POST['currentPassword'], $_POST['password']);
	if ($is_updated === true) {
		echo "ok";
	} else {
		echo "err";
	}
}