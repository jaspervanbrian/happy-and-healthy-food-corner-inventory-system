<?php

session_start();

require_once '../../database/Connection.php';
require_once '../../models/User.php';

use App\Models\User;

$user = new User();

if (isset($_POST['name']) &&
	isset($_POST['username']) &&
	isset($_POST['email_address']) &&
	isset($_POST['role']) &&
	isset($_POST['password']) &&
	isset($_POST['security_question']) &&
	isset($_POST['answer'])
) {
	$is_added = $user->create($_POST['name'], $_POST['username'], $_POST['email_address'], $_POST['role'], $_POST['password'], $_POST['security_question'], $_POST['answer']);
	if ($is_added === true) {
		echo "ok";
	} else {
		if ($is_added === "usernameTaken") {
			echo "usernameTaken";
		} else if ($is_added === "emailTaken") {
			echo "emailTaken";
		} else {
			echo "err";
		}
	}
}