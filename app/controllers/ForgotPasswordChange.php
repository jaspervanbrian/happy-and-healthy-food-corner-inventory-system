<?php

require_once '../database/Connection.php';

use App\Database\Connection;

session_start();

try {
	$connection = new Connection();
	$connection->db_connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	if (isset($_POST['username']) && isset($_POST['new_password'])) {
		$stmt = $connection->db_connection->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
		$stmt->bindParam(':username', $username);
		$username = $_POST['username'];
		$new_password = $_POST['new_password'];
		$stmt->execute();
		if ($stmt->rowCount() <= 0) {
			echo "Invalid";
		} else {
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
			$stmt = $connection->db_connection->prepare("UPDATE users SET password = :new_password WHERE username = :username");
			$stmt->bindParam(':username', $username);
			$stmt->bindParam(':new_password', $new_password);
			$stmt->execute();
			echo "Success";
		}
	} else {
		echo "Invalid";
	}
} catch (PDOException $e) {
	echo "DBError";
}