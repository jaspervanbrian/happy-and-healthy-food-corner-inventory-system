<?php

namespace App\Models;

use App\Database\Connection;

/**
 * summary
 */
class Supplier
{
	private $connection;

	public function __construct()
	{
		$this->connection = new Connection();    
	}
	public function getSupplier($type, $keyword='', $page, $orderby, $step)
    {
    	$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    	if (trim($keyword) !== '') {
			$stmt = $this->connection->db_connection->prepare("SELECT * FROM suppliers WHERE name LIKE :keyword ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
    		if ($type === "name") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM suppliers WHERE name LIKE :keyword ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
    			$keyword =  "%".$keyword ."%";
    		} else if ($type === "location") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM suppliers WHERE location LIKE :keyword ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
                $keyword =  "%".$keyword ."%";
            }

            $index = ($page - 1)*6;
            $upTo = 6;
            $stmt->bindParam(':index', $index, \PDO::PARAM_INT);
            $stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
			$stmt->bindParam(':keyword', $keyword);
			$stmt->execute();

			if ($stmt->rowCount() <= 0) {
				$supplierList = [];
				return $supplierList;
			} else {
				$supplierList = $stmt->fetchAll();
				return $supplierList;
			}
    	} else {
    		$stmt = $this->connection->db_connection->prepare("SELECT * FROM suppliers ORDER BY {$orderby} {$step} LIMIT :index , :upTo");

            $index = ($page - 1)*6;
            $upTo = 6;
            $stmt->bindParam(':index', $index, \PDO::PARAM_INT);
            $stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);

			$stmt->execute();
			if ($stmt->rowCount() <= 0) {
				$supplierList = [];
				return $supplierList;
			} else {
				$supplierList = $stmt->fetchAll();
				return $supplierList;
			}
    	}
    }
    public function getSupplierPages($type, $keyword='')
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        if (trim($keyword) !== '') {
            $stmt = $this->connection->db_connection->prepare("SELECT * FROM suppliers WHERE name LIKE :keyword");
            if ($type === "name") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM suppliers WHERE name LIKE :keyword");
                $keyword =  "%".$keyword ."%";
            } else if ($type === "location") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM suppliers WHERE location LIKE :keyword");
                $keyword =  "%".$keyword ."%";
            }

            $stmt->bindParam(':keyword', $keyword);
            $stmt->execute();
            return $stmt->rowCount();
        } else {
            $stmt = $this->connection->db_connection->prepare("SELECT * FROM suppliers WHERE is_deleted = :is_deleted");
            $stmt->execute();
            return $stmt->rowCount();
        }
    }
    public function create($name, $location, $contact_number)
    {
        $name = trim($name);
        $location = trim($location);
        $contact_number = trim($contact_number);

        if ($name === "" || $location === "" || $contact_number === "") {
            return false;
        }
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("INSERT INTO suppliers (name, location, contact_number) VALUES (:name, :location, :contact_number");
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":location", $location);
        $stmt->bindParam(":contact_number", $contact_number);
        $stmt->execute();
        return true;
    }
    public function delete($id)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("DELETE FROM suppliers WHERE id = :id");
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return true;
    }
    public function getAll() {
    	$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    	$stmt = $this->connection->db_connection->prepare("SELECT * FROM suppliers");
        $stmt->execute();
        if ($stmt->rowCount() <= 0) {
            $supplierList = [];
            return $supplierList;
        } else {
            $supplierList = $stmt->fetchAll();
            return $supplierList;
        }
        return true;
    }
}