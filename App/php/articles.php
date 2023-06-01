<?php
session_start();
include './dbconfig.php';

$data = file_get_contents('php://input');
$uploaddir = $_SERVER["DOCUMENT_ROOT"] .'/App/files/articles/';

$data = json_decode($data, true);
$path = '/App/files/articles/';

$_MyData = [];
$task = $_POST["task"];
if (!$task) {
    $task = $data["task"];
}

switch ($task) {
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
            $sql = "SELECT `articles`.`id`, `name`, `description`, `link`, `author_id`, `article_id` FROM `articles`, `article_user` WHERE article_id = `articles`.`id`";
            $values = [];
            if ($data["search"]) {
                $sql .= " AND (INSTR(name, ?) OR INSTR(description, ?))";
                array_push($values, $data["search"], $data["search"]);
            }
            $step = 10;
            $llim = 0;
            $rlim = $step;
            if ($data['page']) {
                $llim = ($data['page'] - 1) * $step;
                $rlim = $llim + $step;
            }
            $sql .= " LIMIT " .$llim.", ".$rlim;

            $dbh = new PDO($connectData, $DBuser, $DBpassword);

            // Статьи
            $stmt = $dbh->prepare($sql);
            $stmt->execute($values);
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Оценки статей пользователем
            $stmt = $dbh->prepare("SELECT `article_id`, `rate` FROM `article_grade` WHERE user_id = ?");
            $stmt->execute([$_SESSION['auth']['id']]);
            $rates = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Добавляем оценки
            foreach ($res as $key => $value) {
                $stmt = $dbh->prepare("SELECT SUM(rate) AS rate FROM `article_grade` WHERE article_id = ?");
                $stmt->execute([$value['id']]);
                $res[$key]['rate'] = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['rate'];
                foreach ($rates as $rkey => $rvalue) {
                    if ($rvalue['article_id'] == $value['id']) {
                        $res[$key]['user_rate'] = $rvalue['rate'];
                    }
                }
            }


            // Количество статей
            $stmt = $dbh->prepare("SELECT COUNT(*) as articles_count FROM `articles`");
            $stmt->execute([]);
            $articles_count = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['articles_count'];
            if (!$res) {
                echo json_encode(['status' => false, "message" => "Не нашлось ни одной подходящей статьи"]);
            } else {
                echo json_encode(['status' => true, "articles" => $res, "articles_count" => $articles_count]);
            }

            $dbh = null;

        } catch (PDOException $e) {
            echo json_encode(['status' => false]);
            die();
        }
        break;
    case 'grade':
        try {
            $user_id = $_SESSION['auth']['id'];
            $dbh = new PDO($connectData, $DBuser, $DBpassword);

            $stmt = $dbh->prepare("SELECT `id`, `rate` FROM `article_grade` WHERE user_id = ? AND article_id = ?");
            $stmt->execute([$user_id, $data['id']]);
            $id = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $selected = null;

            if (!$id) {
                $stmt = $dbh->prepare("INSERT INTO `article_grade`(`article_id`, `user_id`, `rate`) VALUES (?, ?, ?)");
                $stmt->execute([$data['id'], $user_id, $data['grade']]);
                $selected = "set";
            } elseif ($id[0]['rate'] != $data['grade']) {
                $stmt = $dbh->prepare("UPDATE `article_grade` SET `rate`= ? WHERE user_id = ? AND article_id = ?");
                $stmt->execute([$data['grade'], $user_id, $data['id']]);
                $selected = "change";
            } else {
                $stmt = $dbh->prepare("DELETE FROM `article_grade` WHERE user_id = ? AND article_id = ?");
                $stmt->execute([$user_id, $data['id']]);
                $selected = "remove";
            }
            $stmt = $dbh->prepare("SELECT SUM(rate) as score FROM `article_grade` WHERE article_id = ?");
            $stmt->execute([$data['id']]);
            $score = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['score'];
            echo json_encode(['status' => true, 'score' => $score, 'selected' => $selected]);

            $dbh = null;

        } catch (PDOException $e) {
            echo json_encode(['status' => false]);
            die();
        }
        break;

    default:
        echo json_encode(['status' => false, "message" => "unhandled condition"]);
        break;
}





// SELECT `first_name`, `last_name`, `surename`, `name`, `description`, `link`, `author_id`
//                 FROM `articles`, `article_user`, `employees`, `users`
//                 WHERE `articles`.`id` = 5
//                 AND `article_id` = `articles`.`id`
//                 AND `author_id` = `users`.`id`
//                 AND `users`.`id` = `user_id`


// case 'getArticle':
//     try {
//         $dbh = new PDO($connectData, $DBuser, $DBpassword);
//
//         $stmt = $dbh->prepare("SELECT `first_name`, `last_name`, `surename`, `name`, `description`, `link`, `author_id`
//                         FROM `articles`, `article_user`, `employees`, `users`
//                         WHERE `articles`.`id` = ?
//                         AND `article_id` = `articles`.`id`
//                         AND `author_id` = `users`.`id`
//                         AND `users`.`id` = `user_id`");
//         $stmt->execute([$data['id']]);
//         $article = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
//         $article["path"] = $path;
//
//         if (!$article) {
//             echo json_encode(['status' => false, "message" => "Статьи с таким id не существует"]);
//         } else {
//             echo json_encode(['status' => true, "article" => $article]);
//         }
//
//         $dbh = null;
//
//     } catch (PDOException $e) {
//         echo json_encode(['status' => false]);
//         die();
//     }
//     break;


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
