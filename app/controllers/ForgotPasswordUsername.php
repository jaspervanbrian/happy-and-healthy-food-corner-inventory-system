<?php

require_once '../database/Connection.php';

use App\Database\Connection;

session_start();

try {
	$connection = new Connection();
	$connection->db_connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	if (isset($_POST['username'])) {
		$stmt = $connection->db_connection->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
		$stmt->bindParam(':username', $username);
		$username = $_POST['username'];
		$stmt->execute();
		if ($stmt->rowCount() <= 0) {
			echo "Invalid";
		} else {
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
			echo json_encode($user);
		}
	} else {
		echo "Invalid";
	}
} catch (PDOException $e) {
	echo "DBError";
}