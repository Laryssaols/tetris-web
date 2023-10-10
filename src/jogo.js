"use strict"
const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const lineElement = document.getElementById("line");

if (!localStorage.getItem('tamanhoTabuleiro')) {
    localStorage.setItem('tamanhoTabuleiro', '1')
}

// Porque dessa parte aq?
/* document.addEventListener("DOMContentLoaded", function() {
    const tamanhoTabuleiro = localStorage.getItem("tamanhoTabuleiro");

}); */

class Grid {
    constructor(size = 20, cols = 10, rows = 20) {
        this.cols = cols
        this.rows = rows
        this.size = size
        this.grid = []
        this.reset()
    }

    // Peças no grid
    // 0: Vazio
    // 1: Movendo/ Atual
    // 2: Fixo
    
    //Todo collision function

    setSize() {
        let type = localStorage.getItem("tamanhoTabuleiro")
        alert(type)
        if ( type == 2) {
            this.rows = 44
            this.cols = 22
            this.size = 10
            localStorage.setItem('tamanhoTabuleiro', '1')
        } else {
            this.rows = 20
            this.cols = 10
            this.size = 20
            localStorage.setItem('tamanhoTabuleiro', '2')
        }
        canvas.width = this.cols * this.size;
        canvas.height = this.rows * this.size
    }
    
    reset() {
        this.grid = []
        this.setSize()
        for (let i = 0; i < this.rows; i++) {
            let row = [];
            for(let j = 0; j < this.cols; j++) {
                row.push(0);
            }
            this.grid.push(row);
        }
        console.warn("Grid Reset")
    }


}

class Game {
    static animationId = undefined;
    static frame = 0
    static frameWait = 20
    static grid = new Grid()
    static piece = null;
    static image = null
    static state = undefined;   // Rodando (running), Pausado (paused), 
                                // finalizado (ended), antes de rodar (undefined)

    static start() {
        Game.state = 'running';

        Game.generateRandomPiece()

        return Game.animationId = requestAnimationFrame(Game.loop)
    }

    static loop() {
        console.log(Game.animationId)
        if (Game.frame < Game.frameWait) {
            Game.frame++;
            return Game.animationId = requestAnimationFrame(Game.loop)
        }

        Game.frame = 0;

        Game.resetCanvas();

        Game.drawPiece();

        Game.movePiece({x: 0, y: 1})

        true ? Game.animationId = requestAnimationFrame(Game.loop) : undefined;
    }

    static resetCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    static generateRandomPiece() {
        let num = Math.floor(Math.random() * 7)

        num = (num != 6 ? num : -1)

        Game.piece = new Peca(num)

        let ini_x = Math.ceil(Game.grid.cols/2)
        
        Game.movePiece({x: ini_x, y: 0})
    }

    static drawPiece() {
        ctx.fillStyle = Game.piece.cor
        Game.piece.forma.forEach(el => {
            let {x, y} = el;
            let size = Game.grid.size
            let ini_x = (x * size);
            let ini_y = (y * size);
    
            ctx.fillRect(ini_x, ini_y, size-1, size-1);
        })
    }

    static controlKeys(key) {
        switch (Game.state) {
            case 'running':
                if (key === 'Escape')
                    Game.pause();
                else if (key === 'ArrowUp')
                    Game.rotatePiece();
                else if (key === 'ArrowLeft')
                    Game.movePiece({x: -1, y: 0})
                else if (key === 'ArrowRight')
                    Game.movePiece({x: 1, y:0})
                else if (key === 'ArrowDown')
                    Game.movePiece({x: 0, y:1})
                break;
            case 'paused':
                if (key === 'Escape' || key === 'Enter')
                    Game.resume()
                break;
            case 'ended':
                if (key === 'Enter')
                    Game.start()
                else if (key === 's')
                    Game.changeSize()
                break;
            default:
                if (key === 'Enter')
                    Game.start()
                else if (key === 's')
                    Game.changeSize()
                break;
        }
        if (key === 'r') {
            Game.reload()
        }
        console.warn(Game.state)
    }

    static pause() {
        Game.state = 'paused';

        cancelAnimationFrame(Game.animationId);

        Game.imagem('pause')
    }
    static changeSize() {
        Game.grid.setSize();
        Game.resetCanvas()
        Game.imagem('start')
    }

    static reload(){
        Game.state = undefined
        
        if (Game.animationId != undefined) {
            cancelAnimationFrame(Game.animationId)
            Game.animationId = undefined
        }

        Game.resetCanvas();
        
        Game.imagem('start')
    }

    static resume() {
        Game.state = 'running'
        Game.animationId = requestAnimationFrame(Game.loop)
    }

    static movePiece(coords) {
        Game.piece.move(coords);
    }

    static rotatePiece() {
        Game.piece.rotacionarPeca();
    }

    static checkCollision() {
        let colidiu_x = false, colidiu_y = false;
        Game.piece.forma.forEach(quadrado => {
            let {x, y} = quadrado;
            if (x <= 0 || x >= Game.grid.cols - 1) {
                colidiu_x = true;
            }else if (y < 0 || y >= Game.grid.rows -1) {
                colidiu_y = true
            }
        })
    }

    static imagem(type) {
        let img = new Image()
        img.src = (type == 'pause'? '../images/paused_game.png' : '../images/start.png')
        let ini_y = (canvas.height - canvas.width) / 2
        img.onload = () => ctx.drawImage(img, 0, ini_y, canvas.width, canvas.width)
        console.log(ini_y)
    }
}

Game.reload()

document.addEventListener("keydown", e => {
    Game.controlKeys(e.key)
});