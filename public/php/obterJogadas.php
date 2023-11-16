<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tetris";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Conexão falhou: " . $e->getMessage());
}

//pegando todas as jogadas do jogador atual 

$usernameJogadorAtual = $_SESSION['username'];

$stmtJogadas = $pdo->prepare("SELECT * FROM 'result_game' INNER JOIN 'user' on 'iduser' = 'id' where 'username' = :username ORDER BY 'score' DESC");
$stmtJogadas->bindParam(':username', $usernameJogadorAtual);
$stmtJogadas->execute();
$jogadas = $stmtJogadas->fetch(PDO::FETCH_ASSOC);

//iniciou um novo jogo, agora pega o score da nova jogada do mesmo jogador

$stmtScoreNovaJogada = $pdo->prepare("SELECT `score` FROM `result_game` INNER JOIN `user` ON `iduser` = `id` WHERE `username` = :username ORDER BY `score` DESC LIMIT 1");
$stmtScoreNovaJogada->bindParam(':username', $usernameJogadorAtual);
$stmtScoreNovaJogada->execute();
$scoreNovaJogada = $stmtScoreNovaJogada->fetch(PDO::FETCH_ASSOC);

//verifica se a nova jogada é melhor que alguma das existentes ou não

$menorScore = end($jogadas)['score']; //menor

if($scoreNovaJogada['score'] > $menorScore){
    array_pop($jogadas); //se nova jogada for melhor, remove a pior jogada
    $stmtNovaJogada = $pdo->prepare("SELECT * FROM `result_game` INNER JOIN `user` ON `iduser` = `id` WHERE `username` = :username ORDER BY `score` DESC LIMIT 1");
    $stmtNovaJogada->bindParam(':username', $usernameJogadorAtual);
    $stmtNovaJogada->execute();
    $novaJogada = $stmtNovaJogada->fetch(PDO::FETCH_ASSOC);
    $jogadas[] = $novaJogada;
}


    $stmt = $pdo->query("SELECT * FROM result_game ORDER BY score DESC LIMIT 6"); // Limitando a 4 resultados para um ranking mais gerenciável
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    usort($jogadas, function($a, $b) {
        return $b['score'] <=> $a['score'];
    });
    
echo json_encode($jogadas);
?>