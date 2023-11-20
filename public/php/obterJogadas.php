<?php
session_start();
// Obter o ID do usuário
$userId = $_SESSION['userId'];

$servername = "mysql:host=localhost;dbname=tetris";
$username = "root";
$password = "";

try {
    $pdo = new PDO($servername, $username, $password);
} catch (PDOException $e) {
    die("Conexão falhou: " . $e->getMessage());
}

$stmt = $pdo->prepare("SELECT * FROM result_game WHERE iduser = :userId ORDER BY score DESC LIMIT 6"); // Limitando a 6 resultados 
$stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
$stmt->execute();
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
// Formatando a data antes de enviar para o JavaScript
foreach ($result as &$row) {
    $row['time'] = date("i:s", strtotime($row['time']));
}

echo json_encode($result);
?>
