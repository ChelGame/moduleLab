<?php
session_start();

$data = file_get_contents('php://input');

$data = json_decode($data, true);

switch ($data["task"]) {
    case 'checkAuth':
        if ($_SESSION["auth"]) {
            echo json_encode(['result' => true, 'auth' => $_SESSION["auth"]]);
        } else {
            echo json_encode(['result' => false]);
        }
        break;
    default:
        echo json_encode(['result' => "unhandled condition"]);
        break;
}
