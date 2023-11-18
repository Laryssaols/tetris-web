function populateTable() {
    var tableBody = document.getElementById('rankingTable').getElementsByTagName('tbody')[0];

    // Limpa os conteúdos existentes na tabela
    tableBody.innerHTML = '';

    // Itera sobre os dados do ranking e adiciona linhas à tabela
    rankingData.forEach(function(player, index) {
        if (typeof player === 'object') {
            var row = tableBody.insertRow();
            var cellPosition = row.insertCell(0);
            var cellUsername = row.insertCell(1);
            var cellScore = row.insertCell(2);
            var cellLevel = row.insertCell(3);

            cellPosition.textContent = index + 1;
            cellUsername.textContent = player.username;
            cellScore.textContent = player.score;
            cellLevel.textContent = player.level;
        }
    });
}

// Chama a função para preencher a tabela quando a pagina é carregada
document.addEventListener('DOMContentLoaded', function() {
    populateTable();
});
