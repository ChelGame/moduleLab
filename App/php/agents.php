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

            $stmt = $dbh->prepare("SELECT `first_name`, `last_name`, `surename`, `born_date`, `gender`, `family_status`, `childs`, `academic_degree`, `user_id`, `name` as post FROM `employees`, `posts` where post = posts.id");
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
