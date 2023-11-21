<?php
    
  $servername = "localhost";
  $username = "root";
  $password = "";
  $dbname = "tetris";

  session_start();

  // Checa se o ID foi definido na sessão
  if (!isset($_SESSION['userId'])) {
      die("Erro: ID do usuário não está definido na sessão.");
  }

  // Salva o ID do usuário que logou
  $loggedUser = $_SESSION['userId'];

  $conn = new mysqli($servername, $username, $password, $dbname);

  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
  }

  // Atualiza o nome
  if (isset($_POST['newName'])) {
        $newName = $_POST['newName'];
        if(!empty($newName)) {
            $updateName = "UPDATE `user` SET `name` = ? WHERE `id` = ?";
            $stmt = $conn->prepare($updateName);
            $stmt->bind_param("si", $newName, $loggedUser);
            $stmt->execute();

            if ($stmt && $stmt->affected_rows > 0) {
                echo '<script>alert("Nome atualizado com sucesso!");</script>';
            }

            $stmt->close();
        }
    }

  // Atualiza o número do telefone
  if (isset($_POST['phone'])) {
      $newPhone = $_POST['phone'];
      if (!empty($newPhone)) {
        $updatePhone = "UPDATE `user` SET `phone` = ? WHERE `id` = ?";
        $stmt = $conn->prepare($updatePhone);
        $stmt->bind_param("si", $newPhone, $loggedUser);
        $stmt->execute();

        if ($stmt && $stmt->affected_rows > 0) {
            echo '<script>alert("Número de telefone atualizado com sucesso!");</script>';
        }

        $stmt->close();
      }
    }

  // Atualiza a senha
  if (isset($_POST['senhaAtual']) && isset($_POST['novaSenha']) && isset($_POST['confirmarNovaSenha'])) {
    $senhaAtual = $_POST['senhaAtual'];
    $novaSenha = $_POST['novaSenha'];
    $confirmarNovaSenha = $_POST['confirmarNovaSenha'];

    $stmt = $conn->prepare("SELECT `id` FROM `user` WHERE `id` = ? AND `password` = ?");
    $stmt->bind_param("is", $loggedUser, $senhaAtual);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($userId);
    $stmt->fetch();
    $stmt->close();

    if ($userId !== null && $novaSenha === $confirmarNovaSenha) {
        $stmt = $conn->prepare("UPDATE `user` SET `password` = ? WHERE `id` = ?");
        $stmt->bind_param("si", $novaSenha, $loggedUser);
        $stmt->execute();

        if ($stmt && $stmt->affected_rows > 0) {
            echo '<script>alert("Senha atualizado com sucesso!!");</script>';
        }

        $stmt->close();
    } else {
        echo "Erro: Senha atual incorreta ou as novas senhas não coincidem.";
    }
}

  // Atualiza o email
  if (isset($_POST['myemail']) && isset($_POST['emailConfirm'])) {
    $newEmail = $_POST['myemail'];
    $confirmEmail = $_POST['emailConfirm'];

    if ($newEmail === $confirmEmail) {
        $updateEmailQuery = "UPDATE `user` SET `email` = ? WHERE `id` = ?";
        $stmt = $conn->prepare($updateEmailQuery);

        if ($stmt) {
            $stmt->bind_param("si", $newEmail, $loggedUser);
            $stmt->execute();

            // Verifica se a atualização foi bem-sucedida
            if ($stmt->affected_rows > 0) {
                echo '<script>alert("E-mail atualizado com sucesso!");</script>';
            } else {
                echo "Erro: Não foi possível atualizar o e-mail.";
            }

            $stmt->close();

        } else {
            echo "Erro na preparação da consulta.";
        }
    } else {
        echo "Erro: Os endereços de e-mail não coincidem.";
    }
}


?>

<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atualização Cadastro</title>
    <link rel="stylesheet" href="../css/folhaGeral.css">
    <link rel="shortcut icon" href="../images/tetrisIcon.png">
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</head>
<body>

<header>
    <h1 class="h1Atu">Atualização <br>Cadastro</h1>
</header>

<div class="quadros">
    <h2 class="h2Atu" id="infopesso">Informações Pessoais</h2>
    <div class="container">
        <form id="formName" method="post" action="atualizacao.php">

            <label for="newName">NOME COMPLETO</label>
            <input type="text" id="newName" name="newName" placeholder="Digite seu nome completo">

            <label for="nasc">DATA DE NASCIMENTO</label>
            <input type="date" id="nasc" disabled="">

            <label for="cpf">CPF</label>
            <input type="text" id="cpf" placeholder="CPF" disabled="">

            <label for="phone">TELEFONE</label>
            <input type="text" id="phone" name="phone" placeholder="(XX)XXXXX-XXXX">

            <div class="buttonAtu">
                <button type="submit" class="savebtn" id="saveBtnInfopesso">Salvar Alterações</button>
            </div>
        </form>
    </div>
</div>

<div class="quadros"> 
    <h2 class="h2Atu">Configurações de Login</h2>
    <div class="container">
        <form id="configLoginForm" method="post" action="atualizacao.php">
            <label for="username">USERNAME</label>
            <input type="text" id="username" placeholder="Username" disabled="">

            <h3 class="h3Atu">Alterar Senha</h3>
            <label for="senhaAtual">SENHA ATUAL</label>
            <input type="password" id="senhaAtual" name="senhaAtual" placeholder="Digite sua senha atual">

            <label for="novaSenha">NOVA SENHA</label>
            <input type="password" id="novaSenha" name="novaSenha" placeholder="Digite nova senha">

            <label for="novaSenha2">CONFIRMAR NOVA SENHA</label>
            <input type="password" id="confirmarNovaSenha" name="confirmarNovaSenha" placeholder="Confirme nova senha">

            <div class="buttonAtu">
                <button type="submit" class="savebtn" id="saveBtnLogin">Salvar Alterações</button>
            </div>
        </form>
    </div>
</div>

<div class="quadros">
    <h2 class="h2Atu">Gerenciamento de E-mail</h2> 
    <div class="container">
        <form id="configEmailForm" method="post" action="atualizacao.php">
            <label for="myemail">E-MAIL</label>
            <input type="email" id="myemail" name="myemail" placeholder="Digite seu e-mail">
            
            <label for="mymail2">CONFIRMAR E-MAIL</label>
            <input type="email" id="emailConfirm" name="emailConfirm" placeholder="Confirme seu e-mail">

            <div class="buttonAtu">
                <button type="submit" class="savebtn" id="saveBtnEmail">Salvar Alterações</button>
            </div>
        </form> 
    </div>
</div>

<div class="options">
    <a href="jogo.html">
        <img src="../images/voltar.png" alt="voltar">
    </a>
</div>

<footer>
    <p>
        Grupo 04 © 2023
    </p>
</footer>

</body>
</html>
