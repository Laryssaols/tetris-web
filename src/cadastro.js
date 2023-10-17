function limparDados() {

    const dados = document.querySelectorAll("input[type=text], input[type=password], input[type=date], input[type=number]");

    dados.forEach((dado) => {
        dado.value = "";
    });
}