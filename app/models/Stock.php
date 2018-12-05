<?php

namespace App\Models;

use App\Database\Connection;

/**
 * summary
 */
class Stock
{
	private $connection;

    public function __construct()
    {
    	$this->connection = new Connection();    
    }
    public function getInventory($type, $keyword='', $page, $orderby, $step, $is_deleted)
    {
        $is_deleted = (int)$is_deleted;
    	$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    	if (trim($keyword) !== '') {
			$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword AND is_deleted = :is_deleted ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
    		if ($type === "name") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword AND is_deleted = :is_deleted ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
    			$keyword =  "%".$keyword ."%";
    		} else if ($type === "category") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE category LIKE :keyword AND is_deleted = :is_deleted ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
                $keyword =  "%".$keyword ."%";
            } else if ($type === "status") {
    			$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE status LIKE :keyword AND is_deleted = :is_deleted ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
    			$keyword =  "%".$keyword ."%";
    		} else if ($type === "unit") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE unit LIKE :keyword AND is_deleted = :is_deleted ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
                $keyword =  "%".$keyword ."%";
            }

            $index = ($page - 1)*6;
            $upTo = 6;
            $stmt->bindParam(':index', $index, \PDO::PARAM_INT);
            $stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
            $stmt->bindParam(':is_deleted', $is_deleted, \PDO::PARAM_INT);
			$stmt->bindParam(':keyword', $keyword);
			$stmt->execute();

			if ($stmt->rowCount() <= 0) {
				$stockList = [];
				return $stockList;
			} else {
				$stockList = $stmt->fetchAll();
				return $stockList;
			}
    	} else {
    		$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE is_deleted = :is_deleted ORDER BY {$orderby} {$step} LIMIT :index , :upTo");

            $index = ($page - 1)*6;
            $upTo = 6;
            $stmt->bindParam(':index', $index, \PDO::PARAM_INT);
            $stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
            $stmt->bindParam(':is_deleted', $is_deleted, \PDO::PARAM_INT);

			$stmt->execute();
			if ($stmt->rowCount() <= 0) {
				$stockList = [];
				return $stockList;
			} else {
				$stockList = $stmt->fetchAll();
				return $stockList;
			}
    	}
    }
    public function getInventoryPages($type, $keyword='', $is_deleted)
    {
        $is_deleted = (int)$is_deleted;
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        if (trim($keyword) !== '') {
            $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword AND is_deleted = :is_deleted");
            if ($type === "name") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword AND is_deleted = :is_deleted");
                $keyword =  "%".$keyword ."%";
            } else if ($type === "category") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE category LIKE :keyword AND is_deleted = :is_deleted");
                $keyword =  "%".$keyword ."%";
            } else if ($type === "status") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE status LIKE :keyword AND is_deleted = :is_deleted");
                $keyword =  "%".$keyword ."%";
            } else if ($type === "unit") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE unit LIKE :keyword AND is_deleted = :is_deleted");
                $keyword =  "%".$keyword ."%";
            }

            $stmt->bindParam(':keyword', $keyword);
            $stmt->bindParam(':is_deleted', $is_deleted, \PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->rowCount();
        } else {
            $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE is_deleted = :is_deleted");
            $stmt->bindParam(':is_deleted', $is_deleted, \PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->rowCount();
        }
    }
    public function create($name, $category, $unit, $current_qty, $price, $supplier, $low_threshold)
    {
        $name = trim($name);
        $category = trim($category);
        $unit = trim($unit);
        $current_qty = trim($current_qty);
        $price = trim($price);

        if ($name === "" || $category === "" || $unit === "" || $current_qty === "" || $price === "") {
            return false;
        }
        $current_qty = (float)$current_qty;
        $price = (float)$price;
        $low_threshold = (float)$low_threshold;
        $status = "";

        if ($current_qty <= 0) {
            $status = "Needs Replenishment";
        } else if ($current_qty > 0 && $current_qty <= $low_threshold) {
            $status = "Low Stock";
        } else if ($current_qty > $low_threshold) {
            $status = "High Stock";
        }

        $stmt = $this->connection->db_connection->prepare("SELECT * FROM suppliers WHERE id = :supplier");
        $stmt->bindParam(":supplier", $supplier);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            $supplier = $stmt->fetch();
            $supplier_name = $supplier['name'];
            $supplier_location = $supplier['location'];
        } else {
            return false;
        }

        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("INSERT INTO stocks (name, category, unit, current_qty, price, supplier, supplier_location, status, is_deleted, low_threshold) VALUES (:name, :category, :unit, :current_qty, :price, :supplier, :supplier_location, :status, :is_deleted, :low_threshold)");
        $is_deleted = 0;
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":category", $category);
        $stmt->bindParam(":unit", $unit);
        $stmt->bindParam(":current_qty", $current_qty);
        $stmt->bindParam(":price", $price);
        $stmt->bindParam(":supplier", $supplier_name);
        $stmt->bindParam(":supplier_location", $supplier_location);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":is_deleted", $is_deleted, \PDO::PARAM_INT);
        $stmt->bindParam(":low_threshold", $low_threshold);
        $stmt->execute();
        return true;
    }
    public function updatePrice($stock_id, $stock_price)
    {
        date_default_timezone_set("Asia/Manila");
        $date = date("Y-m-d G:i:s");
        $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET price = :price, last_price_changed = :date WHERE id = :id");
        $stmt->bindParam(":id", $stock_id);
        $stmt->bindParam(":price", $stock_price);
        $stmt->bindParam(":date", $date);
        $stmt->execute();
        return true;
    }
    public function updateSupplier($stock_id, $supplier)
    {
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM suppliers WHERE id = :supplier");
        $stmt->bindParam(":supplier", $supplier);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            date_default_timezone_set("Asia/Manila");
            $date = date("Y-m-d G:i:s");
            
            $supplier = $stmt->fetch();
            $supplier_name = $supplier['name'];
            $supplier_location = $supplier['location'];
            $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET supplier = :supplier, supplier_location = :supplier_location, last_supplier_changed = :date WHERE id = :id");
            $stmt->bindParam(":id", $stock_id);
            $stmt->bindParam(":supplier", $supplier_name);
            $stmt->bindParam(":supplier_location", $supplier_location);
            $stmt->bindParam(":date", $date);
            $stmt->execute();
            return true;
        } else {
            return false;
        }
    }
    public function updateDetails($stock_id, $name, $former_name, $unit, $category, $current_qty, $low_threshold)
    {
        $status = "";
        $current_qty = (float)$current_qty;
        $low_threshold = (float)$low_threshold;

        if ($current_qty <= 0) {
            $status = "Needs Replenishment";
        } else if ($current_qty > 0 && $current_qty <= $low_threshold) {
            $status = "Low Stock";
        } else if ($current_qty > $low_threshold) {
            $status = "High Stock";
        }
        $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET name = :name, former_name = :former_name, unit = :unit, category = :category, status = :status, low_threshold = :low_threshold WHERE id = :id");
        $stmt->bindParam(":id", $stock_id);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":former_name", $former_name);
        $stmt->bindParam(":unit", $unit);
        $stmt->bindParam(":category", $category);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":low_threshold", $low_threshold);
        $stmt->execute();
        return true;
    }
    public function destroy($stock_id)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET is_deleted = :deleted WHERE id = :stock_id");
        // DELETE FROM stocks WHERE id = :stock_id
        $deleted = 1;
        $stmt->bindParam(":deleted", $deleted, \PDO::PARAM_INT);
        $stmt->bindParam(":stock_id", $stock_id);
        $stmt->execute();
        return true;
    }
    public function recover($stock_id)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET is_deleted = :deleted WHERE id = :stock_id");
        // DELETE FROM stocks WHERE id = :stock_id
        $deleted = 0;
        $stmt->bindParam(":deleted", $deleted, \PDO::PARAM_INT);
        $stmt->bindParam(":stock_id", $stock_id);
        $stmt->execute();
        return true;
    }
    public function delete($stock_id)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("DELETE FROM stocks WHERE id = :stock_id");
        $stmt->bindParam(":stock_id", $stock_id);
        $stmt->execute();
        return true;
    }
}