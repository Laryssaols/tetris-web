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

$usernameJogadorAtual = isset($_SESSION['username']) ? $_SESSION['username'] : null;

function getRankingData($pdo, $usernameJogadorAtual) {
    $stmt = $pdo->prepare("SELECT  `result_game`.`score`, `result_game`.`level`, `user`.`userName` FROM `result_game` 
                        INNER JOIN `user` ON `result_game`.`iduser` = `user`.`id` 
                        ORDER BY  `result_game`.`score` DESC");
    $stmt->execute();
    $allPlayers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $posicaoJogadorAtual = array_search($usernameJogadorAtual, array_column($allPlayers, 'userName'));

    $topPlayers = array_slice($allPlayers, 0, 10);

    while (count($topPlayers) < 10) {
        $topPlayers[] = array('score' => 'NULL', 'level' => 'NULL', 'userName' => 'NULL');
    }

    return ['topPlayers' => $topPlayers, 'posicaoJogadorAtual' => $posicaoJogadorAtual];
}  

$rankingData = getRankingData($pdo, isset($_SESSION['username']) ? $_SESSION['username'] : null);

$topPlayers = $rankingData['topPlayers'];
$posicaoJogadorAtual = $rankingData['posicaoJogadorAtual'];
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
        <h1 class="tituloRanking">
            Ranking
        </h1>
        <h3 class="subtituloRanking">
            top players scores of the game
        </h3>
    </header>

    <main>
        <?php
            echo "<p class='celulaEspecial'>Sua posição é: " . ($posicaoJogadorAtual + 1) . "</p>";
        ?>

        <table class="fundoTabela">
            <tr>
                <th>
                    <p class="nomesEconteudoRanking">
                        position
                    </p>
                </th>
                <th>
                    <p class="nomesEconteudoRanking">
                        username
                    </p>
                </th>
                <th>
                    <p class="nomesEconteudoRanking">
                        score
                    </p>
                </th>
                <th>
                    <p class="nomesEconteudoRanking">
                        level
                    </p>
                </th>
            </tr>
            <?php
                foreach ($topPlayers as $position => $player) {
                    echo "<tr>";

                    echo "<td><p class='nomesEconteudoRanking'>" . ($position + 1) . "</p></td>";

                    if ($player['userName'] != 'NULL') {
                        echo "<td><p class='nomesEconteudoRanking'>" . $player['userName'] . "</p></td>";
                        echo "<td><p class='nomesEconteudoRanking'>" . $player['score'] . "</p></td>";
                        echo "<td><p class='nomesEconteudoRanking'>" . $player['level'] . "</p></td>";
                    } else {
                        echo "<td><p class='nomesEconteudoRanking'>VOID</p></td>";
                        echo "<td><p class='nomesEconteudoRanking'>VOID</p></td>";
                        echo "<td><p class='nomesEconteudoRanking'>VOID</p></td>";
                    }

                    echo "</tr>";
                }
            ?>
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
