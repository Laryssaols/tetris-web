<?php
    function authenticate($username, $password) {
        $servername = "localhost";
        $db_username = "root";
        $db_password = "";
        $dbname = "tetris";

        $conn = new mysqli($servername, $db_username, $db_password, $dbname);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $stmt = $conn->prepare("SELECT id, password FROM `user` WHERE userName = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->bind_result($id, $dbPassword);
        $stmt->fetch();
        $stmt->close();
        $conn->close();

        
        if ($id && password_verify($password, $dbPassword)) {
            return $id;
        }

        return null; 
    }

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "tetris";


    session_start();

    // Checa se o ID foi definido na sessão
    if (!isset($_SESSION['id'])) {
        die("Erro: ID do usuário não está definido na sessão.");
    }

    // salva o ID do usuário que logou
    $loggedUser = $_SESSION['id'];

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Atualiza o nome
    if (isset($_POST['newName'])) {
      $newName = $_POST['newName'];
      $updateName = "UPDATE `user` SET `name` = '$newName' WHERE `id` = $loggedInUser";
      $conn->query($updateName);
    }

    // Atualiza o numero do telefone
    if (isset($_POST['phone'])) {
        $newPhone = $_POST['phone'];
        $updatePhone = "UPDATE `user` SET `phone` = '$newPhone' WHERE `id` = $loggedUser";
        $conn->query($updatePhone);
    }

    // Atualiza a senha
    if (isset($_POST['senhaAtual']) && isset($_POST['novaSenha']) && isset($_POST['confirmarNovaSenha'])) {
        $senhaAtual = $_POST['senhaAtual'];
        $novaSenha = $_POST['novaSenha'];
        $confirmarNovaSenha = $_POST['confirmarNovaSenha'];

       //Verifica se a senha esta correta
        $loggedUserId = authenticate($_SESSION['username'], $senhaAtual);

        if ($loggedUserId !== null && $novaSenha === $confirmarNovaSenha) {
          
            $hashedPassword = password_hash($novaSenha, PASSWORD_DEFAULT);
            $updatePassword = "UPDATE `user` SET `password` = '$hashedPassword' WHERE `id` = $loggedUserId";
            $conn->query($updatePassword);
        } else {
            echo "Erro: Senha atual incorreta ou as novas senhas não coincidem.";
        }
    }

    // Atualiza o emial
    if (isset($_POST['myemail']) && isset($_POST['emailConfirm'])) {
        $newEmail = $_POST['myemail'];
        $confirmEmail = $_POST['emailConfirm'];

        if ($newEmail === $confirmEmail) {
            
            $updateEmail = "UPDATE `user` SET `email` = '$newEmail' WHERE `id` = $loggedUser";
            $conn->query($updateEmail);
        } else {
            echo "Erro: Os endereços de e-mail não coincidem.";
        }
    }

    $conn->close();
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
            <input type="text" id="username" placeholder="Username" disabled = "">
                    
            <h3 class="h3Atu">Alterar Senha</h3>
            <label for="senhaAtual">SENHA ATUAL</label>
            <input type="password" id="senhaAtual" name="senhaAtual" placeholder="Digite sua senha atual">
                    
            <label for="novaSenha">NOVA SENHA</label>
            <input type="password" id="novaSenha" name="novaSenha" placeholder="Digite nova senha">
                    
            <label for="novaSenha2">CONFIRMAR NOVA SENHA</label>
            <input type="password" id="confirmarNovaSenha" name="confirmarNovaSenha"  placeholder="Confirme nova senha">
                    
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
