<?php
  session_start();

  $servername = "localhost";
  $username = "root";
  $password = "";
  $dbname = "tetris";

  try {
      $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

      if ($_SERVER["REQUEST_METHOD"] == "POST") {
          // Inicializa as variáveis do formulário
          $oldName = isset($_POST['old_name']) ? $_POST['old_name'] : null;
          $newName = isset($_POST['name']) ? $_POST['name'] : null;
          $newPhone = isset($_POST['phone']) ? $_POST['phone'] : null;

          // Verifica se as variáveis do formulário estão definidas
          if ($oldName !== null && $newName !== null && $newPhone !== null) {
              // SQL para atualizaçáo dos dados
              $stmt = $pdo->prepare("UPDATE user SET name = :newName, phone = :newPhone WHERE name = :oldName");

              $stmt->bindParam(':oldName', $oldName);
              $stmt->bindParam(':newName', $newName);
              $stmt->bindParam(':newPhone', $newPhone);

              $stmt->execute();

              echo "Informações atualizadas com sucesso!";
          } else {
              echo "Erro: Algumas variáveis do formulário não estão definidas.";
          }
      }
  } catch (PDOException $e) {
      echo "Erro ao atualizar informações: " . $e->getMessage();
}
?>
