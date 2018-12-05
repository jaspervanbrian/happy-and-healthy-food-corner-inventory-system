<?php

namespace App\Models;

use App\Database\Connection;
/**
 * summary
 */
class User
{
    /**
     * summary
     */
    private $connection;

    public function __construct()
    {
        $this->connection = new Connection();
    }
    public function create($name, $username, $email_address, $role, $password, $security_question, $answer)
    {
        $name = trim($name);
        $username = trim($username);
        $email_address = trim($email_address);

        if ($name === "" || $username === "" || $email_address === "") {
            return false;
        }
        
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->bindParam(":username", $username);
        $stmt->execute();
        if ($stmt->rowCount() <= 0) {
            $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE email_address = :email_address");
            $stmt->bindParam(":email_address", $email_address);
            $stmt->execute();
            if ($stmt->rowCount() <= 0) {
                $password = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $this->connection->db_connection->prepare("INSERT INTO users (name, username, email_address, role, password, security_question, answer) VALUES (:name, :username, :email_address, :role, :password, :security_question, :answer)");
                $stmt->bindParam(":name", $name);
                $stmt->bindParam(":username", $username);
                $stmt->bindParam(":email_address", $email_address);
                $stmt->bindParam(":role", $role);
                $stmt->bindParam(":password", $password);
                $stmt->bindParam(":security_question", $security_question);
                $stmt->bindParam(":answer", $answer);
                $stmt->execute();
                return true;
            } else {
                return "emailTaken";
            }
        } else {
            return "usernameTaken";
        }
    }
    public function updatePassword($id, $currentPassword, $password, $confirm_password)
    {
        if ($password !== $confirm_password) {
            return "confirm";
        }
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        if ($stmt->rowCount() <= 0) {
            return "err";
        }

        if (password_verify($currentPassword, $user['password'])) {
            $password = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $this->connection->db_connection->prepare("UPDATE users SET password = :password WHERE id = :id");
            $stmt->bindParam(":password", $password);
            $stmt->bindParam(":id", $id);
            $stmt->execute();
            return true;
        } else {
            return "err";
        }
    }
    public function systemAdminUpdatePassword($id, $password, $confirm_password)
    {
        if ($password !== $confirm_password) {
            return "confirm";
        }
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        if ($stmt->rowCount() <= 0) {
            return "err";
        }

        $password = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->connection->db_connection->prepare("UPDATE users SET password = :password WHERE id = :id");
        $stmt->bindParam(":password", $password);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return true;
    }
    public function updateCredentials($id, $name, $username, $email_address, $role)
    {
        $name = trim($name);
        $username = trim($username);
        $email_address = trim($email_address);

        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->bindParam(":id", $id);

        $stmt->execute();
        $user = $stmt->fetch();
        if ($user['name'] === $name &&
            $user['username'] === $username &&
            $user['email_address'] === $email_address &&
            $user['role'] === $role
        ) {
            return false;
        } else {
            if ($user['name'] !== $name) {
                $stmt = $this->connection->db_connection->prepare("UPDATE users SET name = :name WHERE id = :id");
                $stmt->bindParam(":name", $name);
                $stmt->bindParam(":id", $id);
                $stmt->execute();
            }
            if ($user['username'] !== $username) {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE username = :username");
                $stmt->bindParam(":username", $username);
                $stmt->execute();
                if ($stmt->rowCount() <= 0) {
                    $stmt = $this->connection->db_connection->prepare("UPDATE users SET username = :username WHERE id = :id");
                    $stmt->bindParam(":username", $username);
                    $stmt->bindParam(":id", $id);
                    $stmt->execute();
                } else {
                    return "usernameTaken";
                }
            }
            if ($user['email_address'] !== $email_address) {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE email_address = :email_address");
                $stmt->bindParam(":email_address", $email_address);
                $stmt->execute();
                if ($stmt->rowCount() <= 0) {
                    $stmt = $this->connection->db_connection->prepare("UPDATE users SET email_address = :email_address WHERE id = :id");
                    $stmt->bindParam(":email_address", $email_address);
                    $stmt->bindParam(":id", $id);
                    $stmt->execute();
                } else {
                    return "emailTaken";
                }
            }
            if ($user['role'] !== $role) {
                $stmt = $this->connection->db_connection->prepare("UPDATE users SET role = :role WHERE id = :id");
                $stmt->bindParam(":role", $role);
                $stmt->bindParam(":id", $id);
                $stmt->execute();
            }
            if ($id == $_SESSION['user']['id']) {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE id = :id LIMIT 1");
                $stmt->bindParam(':id', $id);
                $stmt->execute();
                $user = $stmt->fetch(\PDO::FETCH_ASSOC);
                $_SESSION['user']['name'] = $user['name'];
                $_SESSION['user']['username'] = $user['username'];
                $_SESSION['user']['email_address'] = $user['email_address'];
                $_SESSION['user']['role'] = $user['role'];
            }
            return true;
        }
    }
    public function adminListPaginate()
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE role = :role");
        $stmt->bindParam(":role", $role);

        $role = "admin";
        $stmt->execute();
        return $stmt->rowCount();
    }
    public function adminList($page)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE role = :role ORDER BY id ASC LIMIT :index, :upTo");
        $stmt->bindParam(":role", $role);
        $stmt->bindParam(":index", $index, \PDO::PARAM_INT);
        $stmt->bindParam(":upTo", $upTo, \PDO::PARAM_INT);

        $role = "admin";
        $index = ($page - 1) * 7;
        $upTo = 7;
        $stmt->execute();
        $admins = $stmt->fetchAll();
        return $admins;
    }
    public function userListPaginate()
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE role = :role");
        $stmt->bindParam(":role", $role);

        $role = "user";
        $stmt->execute();
        return $stmt->rowCount();
    }
    public function userList($page)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE role = :role ORDER BY id ASC LIMIT :index, :upTo");
        $stmt->bindParam(":role", $role);
        $stmt->bindParam(":index", $index, \PDO::PARAM_INT);
        $stmt->bindParam(":upTo", $upTo, \PDO::PARAM_INT);

        $role = "user";
        $index = ($page - 1) * 7;
        $upTo = 7;
        $stmt->execute();
        $users = $stmt->fetchAll();
        return $users;
    }
    public function purchasingListPaginate()
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE role = :role");
        $stmt->bindParam(":role", $role);

        $role = "purchasing";
        $stmt->execute();
        return $stmt->rowCount();
    }
    public function purchasingList($page)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE role = :role ORDER BY id ASC LIMIT :index, :upTo");
        $stmt->bindParam(":role", $role);
        $stmt->bindParam(":index", $index, \PDO::PARAM_INT);
        $stmt->bindParam(":upTo", $upTo, \PDO::PARAM_INT);

        $role = "purchasing";
        $index = ($page - 1) * 7;
        $upTo = 7;
        $stmt->execute();
        $users = $stmt->fetchAll();
        return $users;
    }
    public function deliveryListPaginate()
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE role = :role");
        $stmt->bindParam(":role", $role);

        $role = "delivery";
        $stmt->execute();
        return $stmt->rowCount();
    }
    public function deliveryList($page)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE role = :role ORDER BY id ASC LIMIT :index, :upTo");
        $stmt->bindParam(":role", $role);
        $stmt->bindParam(":index", $index, \PDO::PARAM_INT);
        $stmt->bindParam(":upTo", $upTo, \PDO::PARAM_INT);

        $role = "delivery";
        $index = ($page - 1) * 7;
        $upTo = 7;
        $stmt->execute();
        $users = $stmt->fetchAll();
        return $users;
    }
    public function systemAdminListPaginate()
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE role = :role");
        $stmt->bindParam(":role", $role);

        $role = "systemadmin";
        $stmt->execute();
        return $stmt->rowCount();
    }
    public function systemAdminList($current_admin_id, $page)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE role = :role ORDER BY id ASC LIMIT :index, :upTo");
        $stmt->bindParam(":role", $role);
        $stmt->bindParam(":index", $index, \PDO::PARAM_INT);
        $stmt->bindParam(":upTo", $upTo, \PDO::PARAM_INT);

        $role = "systemadmin";
        $index = ($page - 1) * 7;
        $upTo = 7;
        $stmt->execute();
        $systemAdmins = $stmt->fetchAll();
        foreach ($systemAdmins as &$systemAdmin) {
            if ($current_admin_id === $systemAdmin['id']) {
                $systemAdmin['role'] = "me";
            }
        }
        return $systemAdmins;
    }
}