<?php

namespace App\Models;

use App\Database\Connection;

/**
 * summary
 */
class Particular
{
	private $connection;

	public function __construct()
	{
		$this->connection = new Connection();    
	}
	public function thisMonthParticularPages($stock_id)
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE())");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		return $stmt->rowCount();
	}
	public function thisMonthParticular($stock_id, $page)
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) ORDER BY date_time DESC LIMIT :index, :upTo");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->bindParam(':index', $index, \PDO::PARAM_INT);
		$stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
        $index = ($page - 1)*10;
        $upTo = 10;
		$stmt->execute();
		$particulars = $stmt->fetchAll();
		foreach($particulars as &$particular) {
			$stmt = $this->connection->db_connection->prepare("SELECT name FROM users WHERE id = :user_id LIMIT 1");
			$stmt->bindParam(":user_id", $particular['user_id']);
			$stmt->execute();
			$user = $stmt->fetch();

			$issue_date = date_create($particular['date_time']);
			$particular['issued_by'] = $user['name'];
			$particular['date'] = date_format($issue_date, 'F d, Y');
			$particular['time'] = date_format($issue_date, 'g:i A');
		}
		return $particulars;
	}
	public function create($stock_id, $type, $supplier_reference, $in, $out, $user_id) 
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE id = :stock_id");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		$stock = $stmt->fetch();

		$in = (float)$in;
		$out = (float)$out;
		if ((float)$stock['current_qty'] < $out) {
			return "qty<out";
		} else {
			$current_qty = (float)$stock['current_qty'];
			if ($out < 0 || $in < 0 || ($out <= 0 && $in <= 0 )) {
				return false;
			} else {
				$current_qty -= $out;
				$current_qty += $in;
				$stmt = $this->connection->db_connection->prepare("UPDATE stocks SET current_qty = :current_qty, status = :status WHERE id = :stock_id");
				$stmt->bindParam(":current_qty", $current_qty);
				$stmt->bindParam(":status", $status);
				$stmt->bindParam(":stock_id", $stock_id);

				$status = "";
				if ($current_qty <= 0) {
					$status = "Out of stock";
				} else if ($current_qty > 0 && $current_qty < 11) {
					$status = "Needs Replenishment";
				} else if ($current_qty >= 11 && $current_qty < 21) {
					$status = "Low Stock";
				} else if ($current_qty >= 21) {
					$status = "High Stock";
				}

				$stmt->execute();

				$stmt = $this->connection->db_connection->prepare("INSERT INTO particulars (stock_id, user_id, type, supplier_reference, `in`, `out`, balance, date_time) VALUES (:stock_id, :user_id, :type, :supplier_reference, :in, :out, :balance, NOW())");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(":user_id", $user_id);
				$stmt->bindParam(":type", $type);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->bindParam(":in", $in);
				$stmt->bindParam(":out", $out);
				$stmt->bindParam(":balance", $current_qty);
				$stmt->execute();
				return true;
			}
		}
	}
}