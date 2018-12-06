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
	public function getMonthlyTotals($stock_id)
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare("
			SELECT ROUND(SUM(t1.`in`), 4) ins, ROUND(SUM(t1.`out`), 4) outs
			FROM particulars t1
			WHERE 
			    t1.stock_id = :stock_id AND
			    MONTH(t1.date_time) = MONTH(CURRENT_DATE()) AND
			    YEAR(t1.date_time) = YEAR(CURRENT_DATE())
			GROUP BY
			    MONTH(t1.date_time), YEAR(t1.date_time), t1.stock_id
		");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		if ($stmt->rowCount() <= 0) {
			return "";
		}
		$totals = $stmt->fetch();
		return $totals;
	}
	public function getMonthlyTotalSpoilages($stock_id)
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare("
			SELECT ROUND(SUM(t2.amount), 4) spoilages
			FROM spoilages t2
			WHERE
			    t2.stock_id = :stock_id AND
			    MONTH(t2.date_time) = MONTH(CURRENT_DATE()) AND
			    YEAR(t2.date_time) = YEAR(CURRENT_DATE())
			GROUP BY
			    MONTH(t2.date_time), YEAR(t2.date_time), t2.stock_id
		");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		if ($stmt->rowCount() <= 0) {
			return "";
		}
		$totalSpoilage = $stmt->fetch();
		return $totalSpoilage;
	}
	public function thisMonthParticularPages($stock_id, $type_search, $reference_keyword_search, $from_date, $to_date)
	{
		$supplier_reference = "%" . $reference_keyword . "%";
		if($from_date === "" || $to_date === "") {
			if ($type_search === "All") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND supplier_reference LIKE :supplier_reference");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->execute();
				return $stmt->rowCount();
			} else if ($type_search === "Purchase Order") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND supplier_reference LIKE :supplier_reference AND type = 'Purchase Order'");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->execute();
				return $stmt->rowCount();
			} else if ($type_search === "Delivery") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND supplier_reference LIKE :supplier_reference AND (type = 'Delivery to UST Branch' OR type = 'Delivery to De La Salle Branch')");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->execute();
				return $stmt->rowCount();
			} else if ($type_search === "Delivery to UST Branch") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND supplier_reference LIKE :supplier_reference AND type = 'Delivery to UST Branch'");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->execute();
				return $stmt->rowCount();
			} else if ($type_search === "Delivery to De La Salle Branch") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND supplier_reference LIKE :supplier_reference AND type = 'Delivery to De La Salle Branch'");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->execute();
				return $stmt->rowCount();
			}
		} else {
			if (strtotime($from_date) > strtotime($to_date)) {
				$temp_date = $to_date;
				$to_date = $from_date;
				$from_date = $temp_date;
			}
			if ($type_search === "All") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND supplier_reference LIKE :supplier_reference AND date_time BETWEEN :from_date AND :to_date");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->bindParam(":from_date", $from_date);
				$stmt->bindParam(":to_date", $to_date);
				$stmt->execute();
				return $stmt->rowCount();
			} else if ($type_search === "Purchase Orders") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND supplier_reference LIKE :supplier_reference AND type = 'Purchase Order' AND date_time BETWEEN :from_date AND :to_date");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->bindParam(":from_date", $from_date);
				$stmt->bindParam(":to_date", $to_date);
				$stmt->execute();
				return $stmt->rowCount();
			} else if ($type_search === "Delivery") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND supplier_reference LIKE :supplier_reference AND (type = 'Delivery to UST Branch' OR type = 'Delivery to De La Salle Branch') AND date_time BETWEEN :from_date AND :to_date");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->bindParam(":from_date", $from_date);
				$stmt->bindParam(":to_date", $to_date);
				$stmt->execute();
				return $stmt->rowCount();
			} else if ($type_search === "Delivery to UST Branch") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND supplier_reference LIKE :supplier_reference AND type = 'Delivery to UST Branch' AND date_time BETWEEN :from_date AND :to_date");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->bindParam(":from_date", $from_date);
				$stmt->bindParam(":to_date", $to_date);
				$stmt->execute();
				return $stmt->rowCount();
			} else if ($type_search === "Delivery to De La Salle Branch") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND supplier_reference LIKE :supplier_reference AND type = 'Delivery to De La Salle Branch' AND date_time BETWEEN :from_date AND :to_date");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->bindParam(":from_date", $from_date);
				$stmt->bindParam(":to_date", $to_date);
				$stmt->execute();
				return $stmt->rowCount();
			}
		}
	}
	public function thisMonthParticular($stock_id, $type_search, $reference_keyword, $page, $from_date, $to_date)
	{
		$supplier_reference = "%" . $reference_keyword . "%";
		if($from_date === "" || $to_date === "") {
			if ($type_search === "All") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND supplier_reference LIKE :supplier_reference ORDER BY date_time ASC LIMIT :index, :upTo");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(':index', $index, \PDO::PARAM_INT);
				$stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
		        $index = ($page - 1)*5;
		        $upTo = 5;
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
			} else if ($type_search === "Purchase Order") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND supplier_reference LIKE :supplier_reference AND type = 'Purchase Order' ORDER BY date_time ASC LIMIT :index, :upTo");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(':index', $index, \PDO::PARAM_INT);
				$stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
		        $index = ($page - 1)*5;
		        $upTo = 5;
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
			} else if ($type_search === "Delivery") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND supplier_reference LIKE :supplier_reference AND (type = 'Delivery to UST Branch' OR type = 'Delivery to De La Salle Branch') ORDER BY date_time ASC LIMIT :index, :upTo");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(':index', $index, \PDO::PARAM_INT);
				$stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
		        $index = ($page - 1)*5;
		        $upTo = 5;
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
			} else if ($type_search === "Delivery to UST Branch") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND supplier_reference LIKE :supplier_reference AND type = 'Delivery to UST Branch' ORDER BY date_time ASC LIMIT :index, :upTo");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(':index', $index, \PDO::PARAM_INT);
				$stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
		        $index = ($page - 1)*5;
		        $upTo = 5;
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
			} else if ($type_search === "Delivery to De La Salle Branch") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND supplier_reference LIKE :supplier_reference AND type = 'Delivery to De La Salle Branch' ORDER BY date_time ASC LIMIT :index, :upTo");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(':index', $index, \PDO::PARAM_INT);
				$stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
		        $index = ($page - 1)*5;
		        $upTo = 5;
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
		} else {
			if (strtotime($from_date) > strtotime($to_date)) {
				$temp_date = $to_date;
				$to_date = $from_date;
				$from_date = $temp_date;
			}
			if ($type_search === "All") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND supplier_reference LIKE :supplier_reference AND date_time BETWEEN :from_date AND :to_date ORDER BY date_time ASC LIMIT :index, :upTo");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(':index', $index, \PDO::PARAM_INT);
				$stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->bindParam(":from_date", $from_date);
				$stmt->bindParam(":to_date", $to_date);
		        $index = ($page - 1)*5;
		        $upTo = 5;
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
			} else if ($type_search === "Purchase Order") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND supplier_reference LIKE :supplier_reference AND type = 'Purchase Order' AND date_time BETWEEN :from_date AND :to_date ORDER BY date_time ASC LIMIT :index, :upTo");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(':index', $index, \PDO::PARAM_INT);
				$stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->bindParam(":from_date", $from_date);
				$stmt->bindParam(":to_date", $to_date);
		        $index = ($page - 1)*5;
		        $upTo = 5;
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
			} else if ($type_search === "Delivery") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND supplier_reference LIKE :supplier_reference AND (type = 'Delivery to UST Branch' OR type = 'Delivery to De La Salle Branch') AND date_time BETWEEN :from_date AND :to_date ORDER BY date_time ASC LIMIT :index, :upTo");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(':index', $index, \PDO::PARAM_INT);
				$stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->bindParam(":from_date", $from_date);
				$stmt->bindParam(":to_date", $to_date);
		        $index = ($page - 1)*5;
		        $upTo = 5;
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
			} else if ($type_search === "Delivery to UST Branch") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND supplier_reference LIKE :supplier_reference AND type = 'Delivery to UST Branch' AND date_time BETWEEN :from_date AND :to_date ORDER BY date_time ASC LIMIT :index, :upTo");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(':index', $index, \PDO::PARAM_INT);
				$stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->bindParam(":from_date", $from_date);
				$stmt->bindParam(":to_date", $to_date);
		        $index = ($page - 1)*5;
		        $upTo = 5;
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
			} else if ($type_search === "Delivery to De La Salle Branch") {
				$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND supplier_reference LIKE :supplier_reference AND type = 'Delivery to De La Salle Branch' AND date_time BETWEEN :from_date AND :to_date ORDER BY date_time ASC LIMIT :index, :upTo");
				$stmt->bindParam(":stock_id", $stock_id);
				$stmt->bindParam(':index', $index, \PDO::PARAM_INT);
				$stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
				$stmt->bindParam(":supplier_reference", $supplier_reference);
				$stmt->bindParam(":from_date", $from_date);
				$stmt->bindParam(":to_date", $to_date);
		        $index = ($page - 1)*5;
		        $upTo = 5;
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
			SELECT min(monthname(grouped.date_time)) month, round(sum(grouped.`in`), 4) ins, round(sum(grouped.price_balance)) price_balance
			FROM 
			    (SELECT * FROM particulars WHERE stock_id = :stock_id AND YEAR(date_time) = YEAR(CURRENT_DATE())) grouped
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
			SELECT min(monthname(grouped.date_time)) month, round(sum(grouped.`out`), 4) outs, round(sum(grouped.price_balance)) price_balance
			FROM 
			    (SELECT * FROM particulars WHERE stock_id = :stock_id AND YEAR(date_time) = YEAR(CURRENT_DATE())) grouped
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
			SELECT min(monthname(grouped.date_time)) month, round(sum(grouped.`out`), 4) outs, round(sum(grouped.price_balance)) price_balance
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
			SELECT min(monthname(grouped.date_time)) month, round(sum(grouped.`out`), 4) outs, round(sum(grouped.price_balance)) price_balance
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
			    (SELECT * FROM spoilages WHERE stock_id = :stock_id AND YEAR(date_time) = YEAR(CURRENT_DATE())) grouped
			GROUP BY MONTH(date_time), YEAR(date_time)
			ORDER BY min(grouped.date_time) ASC
		");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		$monthlyReportSpoilages = $stmt->fetchAll();
		return $monthlyReportSpoilages;
	}
	public function create($stock_id, $type, $qty, $user_id) 
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE id = :stock_id");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		$stock = $stmt->fetch();

		$qty = (float)$qty;
		if ($type === "Delivery to UST Branch" || $type === "Delivery to De La Salle Branch") {
			if ((float)$stock['current_qty'] < $qty) {
				return "qty<out";
			}
		}
		$category = $stock['category'];
		$current_qty = (float)$stock['current_qty'];
		$low_threshold = (float)$stock['low_threshold'];


		if ($qty <= 0 && ($type === "Delivery to UST Branch" || $type === "Delivery to De La Salle Branch")) {
			return "delivery0";
		} else if ($qty <= 0 && $type === "Purchase Order") {
			return "purchase0";
		} else {
			if ($type === "Delivery to UST Branch" || $type === "Delivery to De La Salle Branch") {
				$current_qty -= $qty;
			} else if ($type === "Purchase Order") {
				$current_qty += $qty;
			}
			$stmt = $this->connection->db_connection->prepare("UPDATE stocks SET current_qty = :current_qty, status = :status WHERE id = :stock_id");
			$stmt->bindParam(":current_qty", $current_qty);
			$stmt->bindParam(":status", $status);
			$stmt->bindParam(":stock_id", $stock_id);

			$status = "";
			$supplier_reference = "";
			
	        if ($current_qty <= 0) {
	            $status = "Needs Replenishment";
	        } else if ($current_qty > 0 && $current_qty <= $low_threshold) {
	            $status = "Low Stock";
	        } else if ($current_qty > $low_threshold) {
	            $status = "High Stock";
	        }

			$stmt->execute();
			if ($type === "Delivery to UST Branch" || $type === "Delivery to De La Salle Branch") {
				$in = 0;
				$out = $qty;
				$price_balance = ($out) * (float)$stock['price'];
			} else if ($type === "Purchase Order") {
				$in = $qty;
				$out = 0;
				$price_balance = ($in) * (float)$stock['price'];
			}

			$stmt = $this->connection->db_connection->prepare("SELECT * FROM particulars WHERE stock_id = :stock_id AND DAY(date_time) = DAY(CURRENT_DATE()) AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE())");
			$stmt->bindParam(":stock_id", $stock_id);
			$stmt->execute();
			$next_id = $stmt->rowCount() + 1;
			$supplier_reference = date('mdY') . "_" . $next_id;
			
			date_default_timezone_set("Asia/Manila");
			$date = date("Y-m-d G:i:s");

			$stmt = $this->connection->db_connection->prepare("INSERT INTO particulars (stock_id, user_id, type, supplier_reference, `in`, `out`, balance, price_balance, date_time) VALUES (:stock_id, :user_id, :type, :supplier_reference, :in, :out, :balance, :price_balance, :date)");
			$stmt->bindParam(":stock_id", $stock_id);
			$stmt->bindParam(":user_id", $user_id);
			$stmt->bindParam(":type", $type);
			$stmt->bindParam(":supplier_reference", $supplier_reference);
			$stmt->bindParam(":in", $in);
			$stmt->bindParam(":out", $out);
			$stmt->bindParam(":balance", $current_qty);
			$stmt->bindParam(":price_balance", $price_balance);
			$stmt->bindParam(":date", $date);
			$stmt->execute();
			return true;
		}
	}
	public function spoilages($stock_id, $spoilage_reference)
	{
		$supplier_reference = "%". $spoilage_reference . "%";
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare("SELECT * FROM spoilages WHERE stock_id = :stock_id AND MONTH(date_time) = MONTH(CURRENT_DATE()) AND YEAR(date_time) = YEAR(CURRENT_DATE()) AND supplier_reference LIKE :supplier_reference ORDER BY date_time ASC");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->bindParam(":supplier_reference", $supplier_reference);
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
	public function addSpoilage($stock_id, $amount, $user_id) 
	{
		$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE id = :stock_id");
		$stmt->bindParam(":stock_id", $stock_id);
		$stmt->execute();
		$stock = $stmt->fetch();

		$amount = (float)$amount;

		if ((float)$stock['current_qty'] < $amount) {
			return "qty<out";
		}

		$category = $stock['category'];
		$current_qty = (float)$stock['current_qty'];
		$low_threshold = (float)$stock['low_threshold'];

		if ($amount <= 0) {
			return false;
		} else {
			$current_qty -= $amount;
			$stmt = $this->connection->db_connection->prepare("UPDATE stocks SET current_qty = :current_qty, status = :status WHERE id = :stock_id");
			$stmt->bindParam(":current_qty", $current_qty);
			$stmt->bindParam(":status", $status);
			$stmt->bindParam(":stock_id", $stock_id);

			$status = "";
			$supplier_reference = "";
			
	        if ($current_qty <= 0) {
	            $status = "Needs Replenishment";
	        } else if ($current_qty > 0 && $current_qty <= $low_threshold) {
	            $status = "Low Stock";
	        } else if ($current_qty > $low_threshold) {
	            $status = "High Stock";
	        }

			$stmt->execute();
			$price_balance = ($amount) * (float)$stock['price'];

			date_default_timezone_set("Asia/Manila");
			$date = date("Y-m-d G:i:s");
			
			$stmt = $this->connection->db_connection->prepare("INSERT INTO spoilages (stock_id, user_id, amount, balance, price_balance, date_time) VALUES (:stock_id, :user_id, :amount, :balance, :price_balance, :date)");
			$stmt->bindParam(":stock_id", $stock_id);
			$stmt->bindParam(":user_id", $user_id);
			$stmt->bindParam(":amount", $amount);
			$stmt->bindParam(":balance", $current_qty);
			$stmt->bindParam(":price_balance", $price_balance);
			$stmt->bindParam(":date", $date);
			$stmt->execute();

			$last_id = $this->connection->db_connection->lastInsertId();
			$supplier_reference = date('mdY') . "_" . $last_id;
			$stmt = $this->connection->db_connection->prepare("UPDATE spoilages SET supplier_reference = :supplier_reference WHERE id = :id");
			$stmt->bindParam(":id", $last_id);
			$stmt->bindParam(":supplier_reference", $supplier_reference);
			$stmt->execute();
			return true;
		}
	}
}