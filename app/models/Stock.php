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
    public function getInventory($type, $keyword='', $page, $orderby, $step)
    {
    	$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    	if (trim($keyword) !== '') {
			$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
    		if ($type === "name") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
    			$keyword =  "%".$keyword ."%";
    		} else if ($type === "category") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE category LIKE :keyword ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
                $keyword =  "%".$keyword ."%";
            } else if ($type === "status") {
    			$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE status LIKE :keyword ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
    			$keyword =  "%".$keyword ."%";
    		} else if ($type === "unit") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE unit LIKE :keyword ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
                $keyword =  "%".$keyword ."%";
            }

            $index = ($page - 1)*6;
            $upTo = 6;
            $stmt->bindParam(':index', $index, \PDO::PARAM_INT);
            $stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
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
    		$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks ORDER BY {$orderby} {$step} LIMIT :index , :upTo");

            $index = ($page - 1)*6;
            $upTo = 6;
            $stmt->bindParam(':index', $index, \PDO::PARAM_INT);
            $stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);

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
    public function getInventoryPages($type, $keyword='')
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        if (trim($keyword) !== '') {
            $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword");
            if ($type === "name") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword");
                $keyword =  "%".$keyword ."%";
            } else if ($type === "category") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE category LIKE :keyword");
                $keyword =  "%".$keyword ."%";
            } else if ($type === "status") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE status LIKE :keyword");
                $keyword =  "%".$keyword ."%";
            } else if ($type === "unit") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE unit LIKE :keyword");
                $keyword =  "%".$keyword ."%";
            }

            $stmt->bindParam(':keyword', $keyword);
            $stmt->execute();
            return $stmt->rowCount();
        } else {
            $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks");
            $stmt->execute();
            return $stmt->rowCount();
        }
    }
    public function create($name, $category, $unit, $current_qty, $price, $supplier, $supplier_location)
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

        $status = "";

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
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("INSERT INTO stocks (name, category, unit, current_qty, price, supplier, supplier_location, status) VALUES (:name, :category, :unit, :current_qty, :price, :supplier, :supplier_location, :status)");
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":category", $category);
        $stmt->bindParam(":unit", $unit);
        $stmt->bindParam(":current_qty", $current_qty);
        $stmt->bindParam(":price", $price);
        $stmt->bindParam(":supplier", $supplier);
        $stmt->bindParam(":supplier_location", $supplier_location);
        $stmt->bindParam(":status", $status);
        $stmt->execute();
        return true;
    }
    public function updatePrice($stock_id, $stock_price)
    {
        $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET price = :price, last_price_changed = NOW() WHERE id = :id");
        $stmt->bindParam(":id", $stock_id);
        $stmt->bindParam(":price", $stock_price);
        $stmt->execute();
        return true;
    }
    public function updateSupplier($stock_id, $supplier, $supplier_location)
    {
        $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET supplier = :supplier, supplier_location = :supplier_location, last_supplier_changed = NOW() WHERE id = :id");
        $stmt->bindParam(":id", $stock_id);
        $stmt->bindParam(":supplier", $supplier);
        $stmt->bindParam(":supplier_location", $supplier_location);
        $stmt->execute();
        return true;
    }
    public function updateDetails($stock_id, $name, $former_name, $unit, $category, $current_qty)
    {
        $status = "";
        $current_qty = (float)$current_qty;
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
        $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET name = :name, former_name = :former_name, unit = :unit, category = :category, status = :status WHERE id = :id");
        $stmt->bindParam(":id", $stock_id);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":former_name", $former_name);
        $stmt->bindParam(":unit", $unit);
        $stmt->bindParam(":category", $category);
        $stmt->bindParam(":status", $status);
        $stmt->execute();
        return true;
    }
    public function destroy($stock_id)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("DELETE FROM stocks WHERE id = :stock_id");
        $stmt->bindParam(":stock_id", $stock_id);
        $stmt->execute();
        return true;
    }
}