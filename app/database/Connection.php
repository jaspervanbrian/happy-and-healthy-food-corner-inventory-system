<?php
namespace App\Database;
class Connection
{
	public $db_connection;
	public function __construct()
	{
		$server = "localhost";
		$db = "happy_and_healthy";
		$username = "root";
		$password = "";
		$this->db_connection = new \PDO("mysql:host={$server};dbname={$db}", $username, $password);
	}
}
