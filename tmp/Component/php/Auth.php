<?php
$data = file_get_contents('php://input');

$data = json_decode($data, true);
$login = $data["login"];
$password = $data["password"];

try {
    $dbh = new PDO('mysql:host=localhost;dbname=moduleLab', "root", 'root');
    $sql = 'SELECT id
    FROM users
    WHERE login = ? AND password = ?';
    $sth = $dbh->prepare($sql);
    $sth->execute([$login, $password]);
    $red = $sth->fetchAll();
    if ($red) {
        echo json_encode(true);
        $dbh = null;
        return;
    }
    $dbh = null;
    echo json_encode(false);
} catch (PDOException $e) {
    echo json_encode(false);
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}
