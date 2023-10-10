"use strict"
const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const lineElement = document.getElementById("line");
const levelElement = document.getElementById("level");


// Porque dessa parte aq?
/* document.addEventListener("DOMContentLoaded", function() {
    const tamanhoTabuleiro = localStorage.getItem("tamanhoTabuleiro");

}); */

var animationId = undefined;
var peca_teste = new Peca(4);
var frame = 0;

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

    pushPiece() {
        Game.piece.forma.forEach()
    }

    changeSize() {
        console.log(this.rows)
        if (localStorage.getItem("tamanhoTabuleiro") == 2) {
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
        this.reset()
    }
    
    reset() {
        this.grid = []
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
    static running = false
    static frame = 0
    static frameWait = 20
    static grid = new Grid()
    static piece = null;

    static start() {
        Game.generateRandomPiece()
        if (!localStorage.getItem('tamanhoTabuleiro')) {
            localStorage.setItem('tamanhoTabuleiro', '1')
        }
    }

    static loop() {
        if (Game.frame < Game.frameWait) {
            Game.frame++;
            return animationId = requestAnimationFrame(Game.loop)
        }

        Game.frame = 0;

        Game.resetCanvas();

        Game.drawPiece();

        Game.movePiece({x: 0, y: 1})

        true ? animationId = requestAnimationFrame(Game.loop) : undefined;
    }

    static resetCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    static generateRandomPiece() {
        let num = Math.floor(Math.random() * 7) 
        num = (num != 6 ? num : -1)
        Game.piece = new Peca(num)
        let initial_x = Math.ceil(Game.grid.cols / 2)
        Game.movePiece({x: initial_x, y: 0})
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
        if (!Game.running) {
            switch (key) {
                case "Enter":
                case " ":
                    console.warn("Jogo inicializado!")
                    Game.running = true;
                    Game.piece.initPeca();
                    Game.movePiece({x: Math.ceil(Game.grid.cols/2), y: 0})
                    animationId = requestAnimationFrame(Game.loop)
                    break;
                case "s":
                    Game.piece.initPeca();
                    Game.grid.changeSize();
                    Game.drawPiece();
                    break;
                default:
                    console.log(key)
                    console.log("Comando não Cadastrado!");
                    break;
            }
        } else if (Game.running) {
            switch(key) {
                case 'ArrowUp':
                    // Game.movePiece({x: +0, y: -1});
                    Game.piece.rotacionarPeca()
                    break;
                case 'ArrowRight':
                    Game.movePiece({x: +1, y: +0});
                    break;
                case 'ArrowDown':
                    Game.movePiece({x: +0, y: +1});
                    break;
                case 'ArrowLeft':
                    Game.movePiece({x: -1, y: +0})
                    break;
                case "Escape":
                    console.warn("Jogo Encerrado!")
                    Game.running = false;
                    animationId == undefined ? undefined : cancelAnimationFrame(animationId);
                    break;
                default:
                    console.log(key)
                    console.log("Comando não Cadastrado!");
                    break;
            }
            Game.checkCollision()
        }
    }

    static movePiece(coords) {
        Game.piece.move(coords);
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
}

Game.start()

document.addEventListener("keydown", e => {
    Game.controlKeys(e.key)
})

