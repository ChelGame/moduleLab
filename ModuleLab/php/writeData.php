<?php
$data = file_get_contents('php://input');
$file = "lab5_Korotin.txt";
$data = json_decode($data, true);
$writeData = file_get_contents($file);
$writeData .= $data["login"] . " ";
$writeData .= $data["password"] . " ";
$writeData .= date("F j, Y, g:i a") . " ";
$writeData .= $_SERVER["REMOTE_ADR"] . " ";
$writeData .= $_SERVER["HTTP_USER_AGENT"] . " ";
$writeData .= "\n";

file_put_contents($file, $writeData);

echo json_encode($writeData);
