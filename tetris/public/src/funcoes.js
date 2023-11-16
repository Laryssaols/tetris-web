const desenhaquadro = () => {
    for (let i = 0; i < ROW; i++) {
        for(let j = 0; j < COL; j++) {
            const currentSquareColor = board[j][i];
            desenhaquadrado(j, i, currentSquareColor);
        }
    }

    for (let scoreElement of scoreElements) scoreElement.innerHTML = score;
    speedElement.innerHTML = readableSpeed[speed]
}

const desenhaquadrado = (y, x, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}