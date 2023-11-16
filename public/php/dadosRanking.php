<?php
session_start();

//conexao padrao com o banco de dados 
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tetris";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
} catch (PDOException $e) {
    die("Conexão falhou: " . $e->getMessage());
}

$usernameJogadorAtual = isset($_SESSION['username']) ? $_SESSION['username'] : null;

//aqui eu peguei o score do jogador atual, pq mesmo que ele esteja abaixo de 10 no ranking, ele precisa aparecer no ranking 
    $scoreJogadorAtual = "SELECT `score` FROM `result_game` INNER JOIN  `user` ON `iduser` = `id` WHERE `username` = :username";
    $stmtScoreJogadorAtual = $pdo->prepare($scoreCurrentPlayer);
    $stmtScoreJogadorAtual->bindParam(':username', $username_do_jogador_atual);
    $stmtScoreJogadorAtualr->execute();
    $scoreJogadorAtualResult = $stmtScoreJogadorAtual->fetch(PDO::FETCH_ASSOC); //isso transforma eles em arrays igual o ultimo projeto do cadastro


//peguei os melhores 10 jogadores pelo score
$stmt = $pdo->prepare("SELECT * FROM `result_game` ORDER BY  `score` DESC LIMIT 10");
$stmt->execute();
$topPlayers = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Debugging output
//var_dump($topPlayers);

//aqui seria substituir o bloco que ficaria o 10º jogador pelo jogador atual 
if (count($topPlayers) >= 10 && $scoreJogadorAtualResult['score'] <= $topPlayers[9]['score']) {
    $stmtJogadorAtual = $pdo->prepare("SELECT * FROM `result_game` INNER JOIN  `user` ON `iduser` = `id` WHERE `username` = :username");
    $stmtJogadorAtual->bindParam(':username', $usernameJogadorAtual);
    $stmtJogadorAtual->execute();
    $topPlayers[9] = $stmtJogadorAtual->fetch(PDO::FETCH_ASSOC);
}

foreach ($topPlayers as $position => $player) {
    echo "<tr>";
    echo "<td><p class='nomesEconteudoRanking'>$position</p></td>";
    echo "<td><p class='nomesEconteudoRanking'>" . (isset($player['username']) ? $player['username'] : '') . "</p></td>";
    echo "<td><p class='nomesEconteudoRanking'>{$player['score']}</p></td>";
    echo "<td><p class='nomesEconteudoRanking'>{$player['level']}</p></td>";
    echo "</tr>";
}
?>
