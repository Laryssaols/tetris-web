<?php
    session_start();

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

    // Função para obter os dados do ranking
    function getRankingData($pdo, $usernameJogadorAtual) {
    
        $scoreJogadorAtual = "SELECT `result_game`.`score`, `result_game`.`level` FROM `result_game` 
                            INNER JOIN `user` ON `result_game`.`iduser` = `user`.`id` 
                            WHERE `user`.`username` = :username";
        $stmtScoreJogadorAtual = $pdo->prepare($scoreJogadorAtual);
        $stmtScoreJogadorAtual->bindParam(':username', $usernameJogadorAtual);
        $stmtScoreJogadorAtual->execute();
        $scoreJogadorAtualResult = $stmtScoreJogadorAtual->fetch(PDO::FETCH_ASSOC);

        // Pegando os melhores 10 jogadores pelo score
        $stmt = $pdo->prepare("SELECT * FROM `result_game` 
                            INNER JOIN `user` ON `result_game`.`iduser` = `user`.`id` 
                            ORDER BY  `result_game`.`score` DESC LIMIT 10");
        $stmt->execute();
        $topPlayers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Substituindo o 10º jogador pelo jogador atual, se necessário
        if (!empty($topPlayers) && count($topPlayers) >= 10 && $scoreJogadorAtualResult['score'] > $topPlayers[9]['score']) {
            $topPlayers[9] = $scoreJogadorAtualResult;
        } elseif (empty($topPlayers)) {
            $topPlayers = array(); // Confere se $topPlayers é um array
        }

        return $topPlayers;
    }

    // Obtem os dados do ranking
    $topPlayers = getRankingData($pdo, isset($_SESSION['username']) ? $_SESSION['username'] : null);

    // Envia dados do ranking como JSON para o JS
    echo "<script>var rankingData = " . json_encode($topPlayers) . ";</script>";

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ranking</title>
    <link rel="shortcut icon" href="tetrisIcon.png">
    <link rel="stylesheet" href="../css/folhaGeral.css">
</head>
<body>
    <header>
        <h1 class="tituloRanking">Ranking</h1>
        <h3 class="subtituloRanking">Top players scores of the game</h3>
    </header>

    <main>
        <!--Aqui será exibido as infos do player atual-->
        <div class="seta">
            <img src="../images/seta.png" alt="seta">
        </div>

        <!--Aqui será exibido as infos do ranking global-->
        <table class="fundoTabela" id="rankingTable">
            <thead>
                <tr>
                    <th><p class="nomesEconteudoRanking">Position</p> </th>
                    <th><p class="nomesEconteudoRanking">Username</p></th>
                    <th><p class="nomesEconteudoRanking">Score</p </th>
                    <th><p class="nomesEconteudoRanking">Level</p></th>
                </tr>
            </thead>
            <tbody>
                <?php
                // Itera sobre os dados do ranking e gera as linhas da tabela
                    foreach ($topPlayers as $index => $player) {
                        echo "<tr>";
                        echo "<td><p class='nomesEconteudoRanking'>" . ($index + 1) . "</p></td>";
                        echo "<td><p class='nomesEconteudoRanking'>" . (isset($player['username']) ? $player['username'] : '') . "</p></td>";
                        echo "<td><p class='nomesEconteudoRanking'>{$player['score']}</p></td>";
                        echo "<td><p class='nomesEconteudoRanking'>{$player['level']}</p></td>";
                        echo "</tr>";
                    }
                ?>
            </tbody>
        </table>
        <div class="options">
            <a href="jogo.html"> <img src="../images/voltar.png" alt="Jogo"></a>
        </div>
    </main>

    <footer>
        <p>
            Grupo 04 © 2023
        </p>
    </footer>

    <script>
        var rankingData = <?php echo json_encode($topPlayers); ?>;
    </script>

    <script src="ranking.js"></script>

</body>
</html>
