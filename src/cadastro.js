// Limpar os campos de dados  

function limparDados() {

    const dados = document.querySelectorAll("input[type=text], input[type=password], input[type=date], input[type=number]");

    dados.forEach((dado) => {
        dado.value = "";
    });
}

// Validação de cadastro

function validarCadastro() {
    const cpf = document.getElementById("cpf").value;
    const dataNasc = document.getElementById("dataNascimento").value;
    const username = document.getElementById("userName").value;
    const nomeCompleto = document.getElementById("nomeCompleto").value;
    const email = document.getElementById("email").value;
    const confirmarEmail = document.getElementById("confirmarEmail").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (!cpf || !dataNascimento || !username || !nomeCompleto || !email || !confirmarEmail || !senha || !confirmarSenha) {
        alert("Por favor, preencha todos os campos.");
    } else if (email !== confirmarEmail) {
        alert("Os campos de e-mail e confirmar e-mail não correspondem.");
    } else if (senha !== confirmarSenha) {
        alert("Os campos de senha e confirmar senha não correspondem.");
    } else {
        alert("Cadastro bem-sucedido!");
        window.location.href = "login.html";
    }
}
