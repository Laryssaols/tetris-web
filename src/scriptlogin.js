
const usuarioInput = document.getElementById("usuario");
const senhaInput = document.getElementById("senha");
const btnJogar = document.getElementById("btn-jogar");

btnJogar.addEventListener("click", function() {
    const usuario = usuarioInput.value;
    const senha = senhaInput.value;
            if (usuario.trim() !== "" && senha.trim() !== "") {
                window.location.href = "tabuleiro.html";
            } else {
                alert("Por favor, preencha ambos os campos de usuário e senha.");
            }
        });