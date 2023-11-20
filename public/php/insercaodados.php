<!-- codigo php -->

<?php
session_start();
// Obter o ID do usuário
$userId = $_SESSION['userId'];

var_dump($_POST["timer"]);

$servername = "mysql:host=localhost;dbname=tetris";
$username = "root";
$password = "";

try {
    $pdo = new PDO($servername, $username, $password);
}
catch (PDOException $e) {
    die("Conexão falhou: ". $e->getMessage());
}

$stmt= $pdo->prepare("INSERT INTO result_game (time, score, level, `lines`, iduser) VALUES(STR_TO_DATE(?, '%i:%s'), ?, ?, ?, ?)");

$stmt->execute([$_POST["timer"], $_POST["score"], $_POST["level"], $_POST["lines"], $userId]); 
?>


