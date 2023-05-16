<?php
session_start();
include './dbconfig.php';

$data = file_get_contents('php://input');

$data = json_decode($data, true);

$_MyData = [
    "publick" => '6LfEDBEmAAAAAOYcCe0fmKhwnA6E7vpoSjdEkrnV',
    "private" => '6LfEDBEmAAAAAAAi1gvoC8ynT8PNHytXkEf9voYW',
];

switch ($data["task"]) {
    case 'register':
        try {
            if (!$data['captcha']) {
                echo json_encode(['status' => false]);
                die();
            }

            $dbh = new PDO($connectData, $DBuser, $DBpassword);
            $login = $data['login'];
            $password = password_hash($data['password'], PASSWORD_BCRYPT);

            // Проверка на добавление нового пользователя
            $stmt = $dbh->prepare("SELECT count(*) as count from users");
            $stmt->execute([]);
            $c1 = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['count'];

            $stmt = $dbh->prepare("INSERT INTO `users`(`login`, `password`, `role_id`) VALUES (?, ?, ?)");
            $stmt->execute([$login, $password, 3]);

            // Проверка на добавление нового пользователя
            // Не берем в расчет возможность добавления пользователя другим человеком в это время.
            $stmt = $dbh->prepare("SELECT count(*) as count from users");
            $stmt->execute([]);
            $c2 = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['count'];

            if ($c1 < $c2) {
                echo json_encode(['status' => true, 'message' => "Вы успешно зарегистрировались."]);
                die();
            }

            echo json_encode(['status' => false, 'message' => "Пользователь с таким именем уже существует уже существует"]);
            $dbh = null;
        } catch (PDOException $e) {
            echo json_encode(['status' => false, 'message' => "Произошла ошибка. Попробуйте позже."]);
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
