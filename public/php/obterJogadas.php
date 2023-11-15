<?php
$servername = "mysql:host=localhost;dbname=tetris";
$username = "root";
$password = "";

try {
    $pdo = new PDO($servername, $username, $password);
} catch (PDOException $e) {
    die("Conexão falhou: " . $e->getMessage());
}

$stmt = $pdo->query("SELECT * FROM result_game ORDER BY score DESC LIMIT 6"); // Limitando a 4 resultados para um ranking mais gerenciável
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Formatando a data antes de enviar para o JavaScript
foreach ($result as &$row) {
    $row['time'] = date("i:s", strtotime($row['time']));
}

echo json_encode($result);
?>
