document.addEventListener('DOMContentLoaded', function() {
  function validarInformacoesPessoais() {
    const nome = document.getElementById('name').value;
    const telefone = document.getElementById('phone').value;

    // Valida se o campo do nome está preenchido
    if(nome.trim() === '') {
      alert('Por favor, preencha o campo com o nome completo.');
      return false;
    }

    // Valida se o telefone está no formato apenas com números
    const telefoneRegex = /^\d{2}\d{5}-\d{4}$/;
    if(!telefoneRegex.test(telefone)) {
        alert('Insira corretamente um número de telefone válido.');
        return false;
    }
    return true;
  }

  function validarConfiguracoesLogin() {
    const senhaAtual = document.getElementById('pwd').value;
    const novaSenha = document.getElementById('npwd').value;
    const confirmarSenha = document.getElementById('apwd').value;

    // Valida se a senha atual está preenchida
    if(senhaAtual.trim() === '') {
      alert('Por favor, preencha o campo de senha atual.');
      return false;
    }

    // Valida se a nova senha e a confirmação coincidem
    if(novaSenha !== confirmarSenha) {
      alert('A nova senha e a confirmação não coincidem.');
      return false;
    }
    return true;
  }

  function validarConfiguracoesEmail() {
    const email = document.getElementById('myemail').value;
    const confirmarEmail = document.getElementById('mymail').value;

    // Valida se o campo de e-mail está preenchido
    if(email.trim() === '') {
      alert('Por favor, preencha o campo de e-mail.');
      return false;
    }

    // Valida se o e-mail e a confirmação coincidem
    if(email !== confirmarEmail) {
      alert('O e-mail e a confirmação não coincidem.');
      return false;
    }
    return true;
  }

  document.getElementById('formInfopesso').addEventListener('submit', function (event) {
    if (!validarInformacoesPessoais()) {
      // Impede o envio do formulário se a validação falhar
      event.preventDefault();
    }
  });

  document.getElementById('configLoginForm').addEventListener('submit', function (event) {
    if (!validarConfiguracoesLogin()) {
      // Impede o envio do formulário se a validação falhar
      event.preventDefault();
    }
  });

  document.getElementById('configEmailForm').addEventListener('submit', function (event) {
    if (!validarConfiguracoesEmail()) {
      // Impede o envio do formulário se a validação falhar
      event.preventDefault();
    }
  });
});
