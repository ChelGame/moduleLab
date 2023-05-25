<?php
session_start();
include './dbconfig.php';

$data = file_get_contents('php://input');

$data = json_decode($data, true);

$_MyData = [];

    /*

    Тут все просто. При запросах учитывать роли, и возможно пустые поля

    */

switch ($data["task"]) {
    case 'getAgents':
        try {
            $dbh = new PDO($connectData, $DBuser, $DBpassword);

            $stmt = $dbh->prepare("SELECT `first_name`, `last_name`, `surename`, `born_date`, `gender`, `family_status`, `childs`, `academic_degree`, `user_id`, `posts`.`name` as post, `disciplines`.`name` as discipline FROM `employees`, `posts`, `disciplines` where post = posts.id AND discipline_id = disciplines.id");
            $stmt->execute([]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($result) {
                echo json_encode(['status' => true, "agents" => $result]);
            } else {
                echo json_encode(['status' => false, "agents" => $result]);
            }
            $dbh = null;
        } catch (PDOException $e) {
            echo json_encode(['status' => false]);
            die();
        }
        break;
    case 'getAgentInform':
        try {
            $dbh = new PDO($connectData, $DBuser, $DBpassword);
            $id = $data['id'];
            $stmt = $dbh->prepare("SELECT `first_name`, `last_name`, `surename`, `born_date`, `gender`, `family_status`, `childs`, `academic_degree`, `user_id`, `post`, `discipline_id` FROM `employees`where user_id = $id");
            $stmt->execute([]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($result) {
                echo json_encode(['status' => true, "agent" => $result]);
            } else {
                echo json_encode(['status' => false, "agents" => $result]);
            }
            $dbh = null;
        } catch (PDOException $e) {
            echo json_encode(['status' => false]);
            die();
        }
        break;
    case 'getPostAndDisciplineData':
        try {
            $dbh = new PDO($connectData, $DBuser, $DBpassword);

            $stmt = $dbh->prepare("SELECT * FROM `posts`");
            $stmt->execute([]);
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $stmt = $dbh->prepare("SELECT * FROM `disciplines`");
            $stmt->execute([]);
            $discipline = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($posts && $discipline) {
                echo json_encode(['status' => true, "posts" => $posts, "discipline" => $discipline]);
            } else {
                echo json_encode(['status' => false]);
            }
            $dbh = null;
        } catch (PDOException $e) {
            echo json_encode(['status' => false]);
            die();
        }
        break;
    case 'removeAgent':
        try {
            if (!$data['id']) {
                echo json_encode(["status" => false, "message" => "id не указан"]);
                die();
            }
            $dbh = new PDO($connectData, $DBuser, $DBpassword);

            $stmt = $dbh->prepare("DELETE FROM `users` WHERE id=?");
            $stmt->execute([$data['id']]);

            $stmt = $dbh->prepare("SELECT id FROM `users` WHERE id=?");
            $stmt->execute([$data['id']]);
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!$res[0]["id"]) {
                echo json_encode(["status" => true, "message" => "Удаление прошло успешно"]);
            } else {
                echo json_encode(["status" => false, "message" => "Удаление не прошло"]);
            }

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









// результат в асоциативный массив
// $user_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

// отправить в json
// echo json_encode()

// Обновить пароль в бд
// foreach ($_MyData as $key => $value) {
//     $_MyData[$key] = password_hash($value, PASSWORD_BCRYPT);
//     $n = $key + 2;
//     $stmt = $dbh->prepare("UPDATE `users` SET `password`=? where id = ?");
//     $stmt->execute([$_MyData[$key], $n]);
//     echo json_encode([
//         "id" => $n,
//         "password" => $value,
//         "res" => password_verify($value, $_MyData[$key])
//     ]);
// }
