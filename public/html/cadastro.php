<?php
$host = "localhost";
$user = "root";
$senha = "";
$database = "tetris";

$connection = new mysqli($host, $user, $senha, $database) or die("ERRO DE CONEXÃO!!!");

if (isset($_POST['cadastrar'])) {
    $user = mysqli_real_escape_string($connection, $_POST['userName']);
    $password = mysqli_real_escape_string($connection, $_POST['password']);
    $name = mysqli_real_escape_string($connection, $_POST['name']);
    $cpf = mysqli_real_escape_string($connection, $_POST['cpf']);
    $email = mysqli_real_escape_string($connection, $_POST['email']);
    $tel = mysqli_real_escape_string($connection, $_POST['telef']);
    $dt_nasc = mysqli_real_escape_string($connection, $_POST['dataNascimento']);

    $query = mysqli_query($connection, "INSERT INTO user(userName, password, name, cpf, email, phone, data_nasc) VALUES ('$user', '$password', '$name', '$cpf', '$email', '$tel', '$dt_nasc')");

    if ($query) {
        header("Location: login.php");
        exit();
    } else {
        echo 'Erro ao inserir dados no banco de dados: ' . mysqli_error($connection);
    }
}
?>






<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>
        Cadastre-se
    </title>
    <link rel="stylesheet" href="../css/folhaGeral.css">
    <link rel="shortcut icon" href="tetrisIcon.png">
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <script src="../../src/cadastro.js"></script>
</head>
<main>

    <body>
    <form method="post" action="cadastro.php" onsubmit="return validarCadastro()">
        <div class="cadastro-container">
            <h1 class="tituloCadastro">Cadastre-se</h1>
            <input type="text" id="userName" name="userName" placeholder="Escolha o Username">
            <input type="password" id="senha" name="password" placeholder="Digite sua senha">
            <input type="password" id="confirmarSenha" placeholder="Confirme sua senha">
            <input type="text" id="nomeCompleto" name="name" placeholder="Digite seu nome completo">
            <input type="number" id="telefone" name="telef" placeholder="Digite seu telefone" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="11">
            <input type="number" id="cpf"  name="cpf" placeholder="Digite seu CPF" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="11">
            <input type="date" id="dataNascimento" name="dataNascimento">
            <input type="text" id="email" name="email" placeholder="Digite seu e-mail">
            <input type="text" id="confirmarEmail"placeholder="Confirme seu e-mail">
           
            <input type="submit" id="btn_cad" name="cadastrar" value="Cadastrar">
             <button onClick="limparDados()">Limpar dados</button>
            
        </div>
</form>
        </body>


</main>


<footer class="cadFooter">
    <p>Grupo 04 © 2023</p>
</footer>

</html>
</footer>

</body>

</html>