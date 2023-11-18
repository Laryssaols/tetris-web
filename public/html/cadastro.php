<?php
$host = "localhost";
$user = "root";
$senha = "";
$database = "tetris";

$connection = new mysqli($host, $user, $senha, $database) or die ("ERRO DE CONEXÃO!!!");


if (isset($_POST['cadastrar'])) {
    $user = $_POST['userName'];
    $password = $_POST['password'];
    $name = $_POST['name'];
    $cpf = $_POST['cpf'];
    $email = $_POST['email'];

    $query= mysqli_query($connection, "INSERT INTO user(userName, password, name, cpf, email) VALUES ('$user', '$password', '$name', '$cpf', '$email')");


    if($query){
        header("Location: login.php");
    }else{
        echo 'eita tristeza infinita';
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
<form method = "post" action="cadastro.php">
        <div class="cadastro-container">
            <h1 class="tituloCadastro">Cadastre-se</h1>
            <input type="text" id="userName" name="userName" placeholder="Escolha o Username">
            <input type="password" id="senha" name="password" placeholder="Digite sua senha">
            <input type="password" id="confirmarSenha" placeholder="Confirme sua senha">
            <input type="text" id="nomeCompleto" name="name" placeholder="Digite seu nome completo">
            <input type="number" id="cpf"  name="cpf" placeholder="Digite seu CPF">
            <input type="date" id="dataNascimento">
            <input type="text" id="email" name="email" placeholder="Digite seu e-mail">
            <input type="text" id="confirmarEmail"placeholder="Confirme seu e-mail">
           
            <button onClick="validarCadastro()" name="cadastrar">Cadastrar</button>
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