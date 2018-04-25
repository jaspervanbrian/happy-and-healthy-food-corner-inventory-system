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
		$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND (type = 'Delivery to UST Branch' OR type = 'Delivery to De La Salle Branch' OR type = 'Purchase Order')");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		return $stmt->rowCount();
	}
	public function thisMonthParticular($stock_id, $page)
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND (type = 'Delivery to UST Branch' OR type = 'Delivery to De La Salle Branch' OR type = 'Purchase Order') ORDER BY date_time DESC LIMIT :index, :upTo");
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
	public function monthlyReport($stock_id)
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare
		("
			SELECT MAX(monthname(grouped.date_time)) month, round(MAX(grouped.balance), 4) balance
			FROM 
			    (
			        SELECT * FROM particulars p1
			        RIGHT JOIN
			            (SELECT stock_id sid, MAX(date_time) latest FROM particulars GROUP BY sid, MONTH(date_time), YEAR(date_time)) p2
			        ON p1.date_time = p2.latest AND p1.stock_id = p2.sid
			        WHERE p1.stock_id = :stock_id AND YEAR(p1.date_time) = YEAR(CURRENT_DATE())
			    ) grouped
			GROUP BY MONTH(date_time), YEAR(date_time)
			ORDER BY MAX(grouped.date_time) ASC
		");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		$monthlyReport = $stmt->fetchAll();
		foreach($monthlyReport as &$monthly) {
			$stmt = $this->connection->db_connection->prepare("SELECT price FROM stocks WHERE id = :stock_id");
			$stmt->bindParam(":stock_id", $stock_id);
			$stmt->execute();
			$stock = $stmt->fetch();
			$monthly['price_balance'] = ((float)$monthly['balance']) * ((float)$stock['price']);
		}
		return $monthlyReport;
	}
	public function monthlyReportIns($stock_id)
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare
		("
			SELECT min(monthname(grouped.date_time)) month, round(sum(grouped.amount), 4) ins, round(sum(grouped.price_balance)) price_balance
			FROM 
			    (SELECT * FROM particulars WHERE stock_id = :stock_id AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND type = 'Purchase Order') grouped
			GROUP BY MONTH(date_time), YEAR(date_time)
			ORDER BY min(grouped.date_time) ASC
		");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		$monthlyReportIns = $stmt->fetchAll();
		return $monthlyReportIns;
	}
	public function monthlyReportOuts($stock_id)
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare
		("
			SELECT min(monthname(grouped.date_time)) month, round(sum(grouped.amount), 4) outs, round(sum(grouped.price_balance)) price_balance
			FROM 
			    (SELECT * FROM particulars WHERE stock_id = :stock_id AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND (type = 'Delivery to UST Branch' OR type = 'Delivery to De La Salle Branch')) grouped
			GROUP BY MONTH(date_time), YEAR(date_time)
			ORDER BY min(grouped.date_time) ASC
		");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		$monthlyReportOuts = $stmt->fetchAll();
		return $monthlyReportOuts;
	}
	public function monthlyReportOutsUST($stock_id)
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare
		("
			SELECT min(monthname(grouped.date_time)) month, round(sum(grouped.amount), 4) outs, round(sum(grouped.price_balance)) price_balance
			FROM 
			    (SELECT * FROM particulars WHERE stock_id = :stock_id AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND type = 'Delivery to UST Branch') grouped
			GROUP BY MONTH(date_time), YEAR(date_time)
			ORDER BY min(grouped.date_time) ASC
		");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		$monthlyReportOuts = $stmt->fetchAll();
		return $monthlyReportOuts;
	}
	public function monthlyReportOutsDLSU($stock_id)
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare
		("
			SELECT min(monthname(grouped.date_time)) month, round(sum(grouped.amount), 4) outs, round(sum(grouped.price_balance)) price_balance
			FROM 
			    (SELECT * FROM particulars WHERE stock_id = :stock_id AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND type = 'Delivery to De La Salle Branch') grouped
			GROUP BY MONTH(date_time), YEAR(date_time)
			ORDER BY min(grouped.date_time) ASC
		");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		$monthlyReportOuts = $stmt->fetchAll();
		return $monthlyReportOuts;
	}
	public function monthlyReportSpoilages($stock_id)
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare
		("
			SELECT min(monthname(grouped.date_time)) month, round(sum(grouped.amount), 4) spoilages, round(sum(grouped.price_balance)) price_balance
			FROM 
			    (SELECT * FROM particulars WHERE stock_id = :stock_id AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND type = 'Spoilage') grouped
			GROUP BY MONTH(date_time), YEAR(date_time)
			ORDER BY min(grouped.date_time) ASC
		");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		$monthlyReportSpoilages = $stmt->fetchAll();
		return $monthlyReportSpoilages;
	}
	public function create($stock_id, $type, $amount, $user_id) 
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE id = :stock_id");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		$stock = $stmt->fetch();

		$amount = (float)$amount;
		if ($type === "Delivery to UST Branch" || $type === "Delivery to De La Salle Branch" || $type === "Spoilage") {
			if ((float)$stock['current_qty'] < $amount) {
				return "qty<out";
			}
		}
		$category = $stock['category'];
		$current_qty = (float)$stock['current_qty'];
		if ($amount <= 0) {
			return false;
		} else {
			if ($type === "Delivery to UST Branch" || $type === "Delivery to De La Salle Branch" || $type === "Spoilage") {
				$current_qty -= $amount;
			} else if ($type === "Purchase Order") {
				$current_qty += $amount;
			}
			$stmt = $this->connection->db_connection->prepare("UPDATE stocks SET current_qty = :current_qty, status = :status WHERE id = :stock_id");
			$stmt->bindParam(":current_qty", $current_qty);
			$stmt->bindParam(":status", $status);
			$stmt->bindParam(":stock_id", $stock_id);

			$status = "";
			$supplier_reference = "";
			if ($category === "Meat") {
				if ($current_qty <= 0) {
					$status = "Out of stock";
				} else if ($current_qty > 0 && $current_qty < 5) {
					$status = "Needs Replenishment";
				} else if ($current_qty >= 5 && $current_qty < 20) {
					$status = "Low Stock";
				} else if ($current_qty >= 20) {
					$status = "High Stock";
				}
			} else if ($category === "Vegetables") {
				if ($current_qty <= 0) {
					$status = "Out of stock";
				} else if ($current_qty > 0 && $current_qty < 5) {
					$status = "Needs Replenishment";
				} else if ($current_qty >= 5 && $current_qty < 20) {
					$status = "Low Stock";
				} else if ($current_qty >= 20) {
					$status = "High Stock";
				}
			} else if ($category === "Packaging") {
				if ($current_qty <= 0) {
					$status = "Out of stock";
				} else if ($current_qty > 0 && $current_qty < 1500) {
					$status = "Needs Replenishment";
				} else if ($current_qty >= 1500 && $current_qty < 3000) {
					$status = "Low Stock";
				} else if ($current_qty >= 3000) {
					$status = "High Stock";
				}
			} else if ($category === "Grocery") {
				if ($current_qty <= 0) {
					$status = "Out of stock";
				} else if ($current_qty > 0 && $current_qty < 20) {
					$status = "Needs Replenishment";
				} else if ($current_qty >= 20 && $current_qty < 50) {
					$status = "Low Stock";
				} else if ($current_qty >= 50) {
					$status = "High Stock";
				}
			} else if ($category === "Rice") {
				if ($current_qty <= 0) {
					$status = "Out of stock";
				} else if ($current_qty > 0 && $current_qty < 25) {
					$status = "Needs Replenishment";
				} else if ($current_qty >= 25 && $current_qty < 50) {
					$status = "Low Stock";
				} else if ($current_qty >= 50) {
					$status = "High Stock";
				}
			} else if ($category === "Sauce") {
				if ($current_qty <= 0) {
					$status = "Out of stock";
				} else if ($current_qty > 0 && $current_qty < 2) {
					$status = "Needs Replenishment";
				} else if ($current_qty >= 2 && $current_qty < 4) {
					$status = "Low Stock";
				} else if ($current_qty >= 4) {
					$status = "High Stock";
				}
			} else if ($category === "Fruits") {
				if ($current_qty <= 0) {
					$status = "Out of stock";
				} else if ($current_qty > 0 && $current_qty < 50) {
					$status = "Needs Replenishment";
				} else if ($current_qty >= 50 && $current_qty < 100) {
					$status = "Low Stock";
				} else if ($current_qty >= 100) {
					$status = "High Stock";
				}
			}

			$stmt->execute();
			$price_balance = ($amount) * (float)$stock['price'];

			$stmt = $this->connection->db_connection->prepare("INSERT INTO particulars (stock_id, user_id, type, amount, balance, price_balance, date_time) VALUES (:stock_id, :user_id, :type, :amount, :balance, :price_balance, NOW())");
			$stmt->bindParam(":stock_id", $stock_id);
			$stmt->bindParam(":user_id", $user_id);
			$stmt->bindParam(":type", $type);
			$stmt->bindParam(":amount", $amount);
			$stmt->bindParam(":balance", $current_qty);
			$stmt->bindParam(":price_balance", $price_balance);
			$stmt->execute();

			$last_id = $this->connection->db_connection->lastInsertId();
			if ($type === "Delivery to UST Branch" || $type === "Delivery to De La Salle Branch") {
				$supplier_reference = "DR#" . date('dmYHis') . $last_id;
			} else if ($type === "Purchase Order") {
				$supplier_reference = "PO#" . date('dmYHis') . $last_id;
			} else if ($type === "Spoilage") {
				$supplier_reference = "SP#" . date('dmYHis') . $last_id;
			}
			$stmt = $this->connection->db_connection->prepare("UPDATE particulars SET supplier_reference = :supplier_reference WHERE id = :id");
			$stmt->bindParam(":id", $last_id);
			$stmt->bindParam(":supplier_reference", $supplier_reference);
			$stmt->execute();
			return true;
		}
	}
	public function spoilages($stock_id)
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND type = 'Spoilage' ORDER BY date_time DESC");
		$stmt->bindParam(":stock_id", $stock_id);
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
}