<?php
session_start();
include './dbconfig.php';

$data = file_get_contents('php://input');

$data = json_decode($data, true);
$_MyData = [
    "Valera2881",
    "777IAMEVGEHA777",
    "qwerty",
    "ihpaRST",
    "ChelGame",
    "Krovat777",
    "Olga1976112233@",
    "JikjikIssea",
    "23145125sasd@@ss!gsdgsd32yfasdttttxasdafwwafsfa",
    "Admin321",
    "ProphKom.com",
    "OtdelKadrow",
];

switch ($data["task"]) {
    case 'exit':
        try {
            $_SESSION["auth"] = null;
            echo json_encode(['status' => true]);
        } catch (\Exception $e) {
            echo json_encode(['status' => false]);
        }
        break;
    case 'checkAuth':
        $id = $data["auth"]['id'];
        $role = $data["auth"]['role'];

        $sid = $_SESSION["auth"]["id"];
        $srole = $_SESSION["auth"]["role"];

        // Если данные в сессии не совпадают с данными от клиента, сбросить вход
        if ($_SESSION["auth"] && $id == $sid && $role == $srole) {
            echo json_encode(['auth' => $_SESSION["auth"]]);
        } else {
            $_SESSION["auth"] = null;
            echo json_encode(['auth' => false]);
        }
        break;
    case 'auth':
        try {
            $dbh = new PDO($connectData, $DBuser, $DBpassword);
            $login = $data['login'];
            $password = $data['password'];

            $stmt = $dbh->prepare("SELECT id, password, role_id FROM users where login = ?");
            $stmt->execute([$login]);
            $user_data = $stmt->fetchAll()[0];

            if (!password_verify($password, $user_data["password"])) {
                echo json_encode(['auth' => false]);
                die();
            }

            $stmt = $dbh->prepare("SELECT name FROM roles where id = ?");
            $stmt->execute([$user_data["role_id"]]);
            $role_name = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['name'];

            $_SESSION["auth"] = ['id' => $user_data["id"], 'role' => $role_name];

            echo json_encode(['auth' => ['id' => $user_data["id"], 'role' => $role_name]]);

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
