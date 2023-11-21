<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="../css/folhaGeral.css">
    <link rel="shortcut icon" href="../images/tetrisIcon.png">
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</head>
<body>
    <div class="login-container">
        <h1 class="tituloLogin">Login</h1>
        <form method="post" action="login.php">
            <input type="text" placeholder="Usuário" name="usuario" id="usuario">
            <input type="password" placeholder="Senha" name="senha" id="senha">
            <button type="submit" id="btn-jogar">Jogar</button>
            <a href="cadastro.php">Cadastre-se</a>


        </form>
    </div>
    
    <?php
        // Verifica se o formulário se foi enviado 1 vez
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $servername = "localhost";
            $username = "root";
            $password = "";
            $dbname = "tetris";

            $userName = $_POST['usuario']; 
            $passwordInput = $_POST['senha'];

            
            $conn = new mysqli($servername, $username, $password, $dbname);

            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }

            $sql = "SELECT * FROM `user` WHERE `userName` = '$userName' AND `password` = '$passwordInput'";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $userId = $row['id'];
                session_start();
                $_SESSION['userId'] = $userId;

                header("Location: tabuleiro.html");
                exit();
            } else {
                echo "<p class='error-message'>Usuário e senha incorretos</p>";
            }

            $conn->close();
        }
    ?>

<footer class="footerLogin">
    <p>Grupo 04 © 2023</p>
</footer>

<script src= "../../src/scriptlogin.js" defer></script>
</body>
</html>