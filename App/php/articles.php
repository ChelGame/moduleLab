<?php
session_start();
include './dbconfig.php';

$data = file_get_contents('php://input');
$uploaddir = $_SERVER["DOCUMENT_ROOT"] .'/App/files/articles/';

$data = json_decode($data, true);

$_MyData = [];
$tast = $_POST["task"];
if (!$task) {
    $tast = $data["task"];
}

switch ($tast) {
    case 'AddArticle':
        try {
            if ($_FILES['file']['type'] != "application/pdf") {
                echo json_encode(['status' => false, "message" => "Выбранный тип файла не поддерживается"]);
                die;
            }
            if ($_FILES['file']['size'] > 104857600) {
                echo json_encode(['status' => false, "message" => "Размер файла слишком велик"]);
                die;
            }
            $file_name = uniqid() . ".pdf";

            $uploadfile = $uploaddir . basename($file_name);

            if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
                $dbh = new PDO($connectData, $DBuser, $DBpassword);

                $stmt = $dbh->prepare("INSERT INTO `articles`(`name`, `description`, `link`) VALUES (?, ?, ?)");
                $stmt->execute([$_POST["name"], $_POST["description"], $file_name]);

                // Проверяем
                $stmt = $dbh->prepare("SELECT `id` FROM `articles` WHERE link = ?");
                $stmt->execute([$file_name]);
                $id = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['id'];
                if (!$id) {
                    echo json_encode(['status' => false, "message" => "Загрузить не удалось."]);
                    die;
                }

                $stmt = $dbh->prepare("INSERT INTO `article_user`(`author_id`, `article_id`) VALUES (?, ?)");
                $stmt->execute([$_POST["author_id"], $id]);

                // Проверяем
                $stmt = $dbh->prepare("SELECT `id` FROM `article_user` WHERE author_id = ? AND article_id = ?");
                $stmt->execute([$_POST["author_id"], $id]);
                $a_u_id = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['id'];
                if (!$a_u_id) {
                    echo json_encode(['status' => false, "message" => "Загрузить не удалось."]);
                    $stmt = $dbh->prepare("DELETE FROM `articles` WHERE article_id = ?");
                    $stmt->execute([$id]);
                    die;
                }

                echo json_encode(['status' => true, "message" => "Статья успешно добавлена"]);
                $dbh = null;
            } else {
                echo json_encode(['status' => false, "message" => "Загрузить не удалось."]);
                die;
            }

        } catch (PDOException $e) {
            echo json_encode(['status' => false]);
            die();
        }
        break;
    case 'getArticles':
        try {
            $dbh = new PDO($connectData, $DBuser, $DBpassword);

            $stmt = $dbh->prepare("SELECT `name`, `description`, `link`, `author_id`, `article_id` FROM `articles`, `article_user` WHERE article_id = `articles`.`id`");
            $stmt->execute([]);
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!$res) {
                echo json_encode(['status' => false]);
            } else {
                echo json_encode(['status' => true, "articles" => $res]);
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




// <li class="item_article">
//     <a href="/viewArticle" class="articleLink">
//         <h2 class="article_name">Квантование лазерных пучков и их синергетика с квантами нагретой плазмы</h2>
//         <p class="article_description">В статье разобраны базовые принципы квантования лазерных пучков в разных конфигурациях а также их синергии с нагретой плазмой</p>
//     </a>
// </li>




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
