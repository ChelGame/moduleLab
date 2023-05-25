<?php
session_start();
include './dbconfig.php';

$data = file_get_contents('php://input');

$data = json_decode($data, true);

$_MyData = [];

switch ($data["task"]) {
    case 'updateAgent':
        try {
            $dbh = new PDO($connectData, $DBuser, $DBpassword);
            $sql = 'UPDATE `employees` SET `first_name`=?,`last_name`=?,`surename`=?,`born_date`=?,`gender`=?,`family_status`=?,`childs`=?,`post`=?,`academic_degree`=?,`discipline_id`=? WHERE user_id = ?';
            $values = [
                $data["first_name"],
                $data["last_name"],
                $data["surename"],
                $data["born_date"],
                $data["gender"],
                $data["family_status"],
                $data["childs"],
                $data["post"],
                $data["academic_degree"],
                $data["discipline_id"],
                $data["user_id"]
            ];
            $stmt = $dbh->prepare($sql);
            $stmt->execute($values);

            // Проверяем
            $sql = 'SELECT `first_name`, `last_name`, `surename`, `born_date`, `gender`, `family_status`, `childs`, `post`, `academic_degree`, `discipline_id` FROM `employees` WHERE user_id = ?';
            $stmt = $dbh->prepare($sql);
            $stmt->execute([$data["user_id"]]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($result[0] as $key => $value) {
                if ($value != $data[$key]) {
                    echo json_encode(["status" => false]);
                    die();
                }
            }

            if ($data["login"] && $data["password"]) {
                $sql = 'UPDATE `users` SET `login`=?,`password`=? WHERE id = ?';
                $stmt = $dbh->prepare($sql);
                $stmt->execute([$data['login'], password_hash($data['password'], PASSWORD_BCRYPT), $data['user_id']]);

                $sql = 'SELECT `login`, `password` FROM `users` WHERE id = ?';
                $stmt = $dbh->prepare($sql);
                $stmt->execute([$data["user_id"]]);
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($result[0] as $key => $value) {
                    if ($value != $data[$key]) {
                        if ($key == "login") {
                            echo json_encode(["status" => false, "message" => "Похоже, этот логин уже занят или недопустим"]);
                        } else {
                            echo json_encode(["status" => false, "message" => "Похоже, пароль недопустим, попробуйте другой"]);
                        }
                        die();
                    }
                }

            } elseif ($data["password"]) {
                $sql = 'UPDATE `users` SET `password`=? WHERE id = ?';
                $stmt = $dbh->prepare($sql);
                $stmt->execute([password_hash($data['password'], PASSWORD_BCRYPT), $data['user_id']]);

                $sql = 'SELECT `password` FROM `users` WHERE id = ?';
                $stmt = $dbh->prepare($sql);
                $stmt->execute([$data["user_id"]]);
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if (!password_verify($data["password"], $result[0]["password"])) {
                    echo json_encode(["status" => false, "message" => "Похоже, пароль недопустим, попробуйте другой"]);
                    die();
                }

            } elseif ($data["login"]) {
                $sql = 'UPDATE `users` SET `login`=? WHERE id = ?';
                $stmt = $dbh->prepare($sql);
                $stmt->execute([$data['login'], $data['user_id']]);

                $sql = 'SELECT `login` FROM `users` WHERE id = ?';
                $stmt = $dbh->prepare($sql);
                $stmt->execute([$data["user_id"]]);
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($result[0] as $key => $value) {
                    if ($value != $data[$key]) {
                        echo json_encode(["status" => false, "message" => "Похоже, этот логин уже занят или недопустим"]);
                        die();
                    }
                }
            }
            // Логин и пароль менять в другой таблице


            echo json_encode(["status" => true, "result" => $res]);
            // echo json_encode(["status" => true, "vlaues" => $values, "data" => $data]);
            $dbh = null;
        } catch (PDOException $e) {
            echo json_encode(['status' => false]);
            die();
        }
        break;
    case 'addAgent':
        try {
            $dbh = new PDO($connectData, $DBuser, $DBpassword);

            $sql = 'INSERT INTO `users`(`login`, `password`, `role_id`) VALUES (?, ?, ?)';
            $stmt = $dbh->prepare($sql);
            $stmt->execute([$data['login'], password_hash($data['password'], PASSWORD_BCRYPT), 2]);

            $stmt = $dbh->prepare("SELECT id FROM `users` WHERE login = ?");
            $stmt->execute([$data['login']]);
            $user = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (!$user[0]['id']) {
                echo json_encode(["status" => false, "message" => "Не удалось добавить пользователя. Возможно, логин уже занят"]);
                die();
            }
            $values = [
                $data["first_name"],
                $data["last_name"],
                $data["surename"],
                $data["born_date"],
                $data["gender"],
                $data["family_status"],
                $data["childs"],
                $data["post"],
                $data["academic_degree"],
                $data["discipline_id"],
                $user[0]['id']
            ];
            $sql = 'INSERT INTO `employees`(`first_name`, `last_name`, `surename`, `born_date`, `gender`, `family_status`, `childs`, `post`, `academic_degree`, `discipline_id`, `user_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
            $stmt = $dbh->prepare($sql);
            $stmt->execute($values);

            // Проверяем
            $sql = 'SELECT `id` FROM `employees` WHERE user_id = ?';
            $stmt = $dbh->prepare($sql);
            $stmt->execute([$user[0]['id']]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (!$result[0]['id']) {
                echo json_encode(["status" => false, "message" => "Добавить пользователя не удалось, попробуйте позже"]);
                $sql = 'DELETE FROM `employees` WHERE id = ?';
                $stmt = $dbh->prepare($sql);
                $stmt->execute([$user[0]['id']]);
                die();

            }
            echo json_encode(["status" => true, "message" => "Добавление прошло успешно"]);

            $dbh = null;
        } catch (PDOException $e) {
            echo json_encode(['status' => false]);
            die();
        }
        break;
    case 'removeAgent':
        try {
            $dbh = new PDO($connectData, $DBuser, $DBpassword);

            $sql = 'INSERT INTO `users`(`login`, `password`, `role_id`) VALUES (?, ?, ?)';
            $stmt = $dbh->prepare($sql);
            $stmt->execute([$data['login'], password_hash($data['password'], PASSWORD_BCRYPT), 2]);

            $stmt = $dbh->prepare("SELECT id FROM `users` WHERE login = ?");
            $stmt->execute([$data['login']]);
            $user = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (!$user[0]['id']) {
                echo json_encode(["status" => false, "message" => "Не удалось добавить пользователя. Возможно, логин уже занят"]);
                die();
            }
            $values = [
                $data["first_name"],
                $data["last_name"],
                $data["surename"],
                $data["born_date"],
                $data["gender"],
                $data["family_status"],
                $data["childs"],
                $data["post"],
                $data["academic_degree"],
                $data["discipline_id"],
                $user[0]['id']
            ];
            $sql = 'INSERT INTO `employees`(`first_name`, `last_name`, `surename`, `born_date`, `gender`, `family_status`, `childs`, `post`, `academic_degree`, `discipline_id`, `user_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
            $stmt = $dbh->prepare($sql);
            $stmt->execute($values);

            // Проверяем
            $sql = 'SELECT `id` FROM `employees` WHERE user_id = ?';
            $stmt = $dbh->prepare($sql);
            $stmt->execute([$user[0]['id']]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (!$result[0]['id']) {
                echo json_encode(["status" => false, "message" => "Добавить пользователя не удалось, попробуйте позже"]);
                $sql = 'DELETE FROM `employees` WHERE id = ?';
                $stmt = $dbh->prepare($sql);
                $stmt->execute([$user[0]['id']]);
                die();

            }
            echo json_encode(["status" => true, "message" => "Добавление прошло успешно"]);

            $dbh = null;
        } catch (PDOException $e) {
            echo json_encode(['status' => false]);
            die();
        }
        break;
    default:
        echo json_encode(['status' => "unhandled condition"]);
        break;
}
// Потом сделать строгое сравнение с true
