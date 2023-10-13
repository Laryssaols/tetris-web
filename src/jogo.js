"use strict"
const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const lineElement = document.getElementById("line");

if (!localStorage.getItem('tamanhoTabuleiro')) {
    localStorage.setItem('tamanhoTabuleiro', '1')
}

let debug = true;

class Grid {
    constructor(size = 20, cols = 10, rows = 20) {
        this.cols = cols
        this.rows = rows
        this.size = size
        this.grid = []
        this.setSize()
        this.reset()
    }

    putPiece(piece) {
        piece.forma.forEach(el => {
            this.grid[el.y][el.x] = '@';
        })
    }

    checkCollisionY(piece) {
        return piece.forma.some(el => {
            if ((el.y + 1) >= this.grid.length) {
                return true
            } else if (this.grid[el.y + 1][el.x] != null)
                return true;
        });
    }

    checkCollisionX(piece, direction) {
        return piece.forma.some(el => this.grid[el.y][el.x+direction] != null || el.x+direction < 0 || el.x+direction >= this.cols);
    }

    inverteHorizontal() {
        this.grid = this.grid.map(row => {
            for (let i = 0; i <= (row.length) / 2; i++) {
                let aux = row[i]
                row[i] = row[(row.length - 1)-i]
                row[(row.length - 1)-i] = aux
            }
            return row
        })
    }

    setSize() {
        let type = localStorage.getItem("tamanhoTabuleiro")
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
        for (let i = 0; i < this.rows; i++) {
            let row = [];
            for(let j = 0; j < this.cols; j++) {
                row.push(null);
            }
            this.grid.push(row);
        }
    }
}

class Game {
    static animationId = undefined;
    static frame = 0
    static frameWait = 5
    static grid = new Grid()
    static actualPiece = null;
    static fixedPieces = []
    static image = null
    static state = undefined;   // Rodando (running), Pausado (paused), 
                                // finalizado (ended), antes de rodar (undefined)

    static start() {
        Game.state = 'running';

        Game.generateRandomPiece()

        return Game.animationId = requestAnimationFrame(Game.loop)
    }

    static loop() {
        if (Game.frame < Game.frameWait) {
            Game.frame++;
            return Game.animationId = requestAnimationFrame(Game.loop)
        }

        Game.frame = 0;

        Game.resetCanvas();

        Game.drawBackgroundPieces()

        Game.drawPiece(Game.actualPiece);

        Game.movePiece({x: 0, y: 1})

        true ? Game.animationId = requestAnimationFrame(Game.loop) : undefined;
    }

    static drawBackgroundPieces() {
        Game.fixedPieces.forEach(piece => {
            Game.drawPiece(piece)
        })
    }

    static resetCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    static generateRandomPiece() {
        let num = Math.floor(Math.random() * 7)

        num = (num != 6 ? num : -1)
        
        
        Game.actualPiece = new Peca(num)
        
        let ini_x = Math.ceil(Game.grid.cols/2)
        
        Game.movePiece({x: ini_x, y: 0})
        
        let isSpecial = (num == -1 ? true : false);
        
        isSpecial ? Game.inverteHorizontal() : undefined;
    }

    static drawPiece(piece) {
        ctx.fillStyle = piece.cor
        piece.forma.forEach(el => {
            let {x, y} = el;
            let size = Game.grid.size
            let ini_x = (x * size);
            let ini_y = (y * size);
    
            ctx.fillRect(ini_x + 1, ini_y + 1, size - 2, size - 2);
        })
    }

    static inverteHorizontal() {
        Game.grid.inverteHorizontal();
        Game.actualPiece.inverteHorizontal(Game.grid.cols);
        Game.fixedPieces.forEach(el => {
            el.inverteHorizontal(Game.grid.cols);
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
                else if (key === 'i' && debug === true)
                    Game.inverteHorizontal()
                break;
            case 'paused':
                if (key === 'Escape' || key === 'Enter')
                    Game.resume()
                else if (key === 'i' && debug === true) {
                    Game.inverteHorizontal()
                    Game.imagem('pause')
                }
                break;
            case 'ended':
                if (key === 'Enter')
                    Game.start()
                else if (key === 's' && debug === true)
                    Game.changeSize()
                break;
            default:
                if (key === 'Enter')
                    Game.start()
                else if (key === 's' && debug === true)
                    Game.changeSize()
                break;
        }
        if (key === 'r') {
            Game.reload()
        }
    }

    static pause() {
        Game.state = 'paused';

        cancelAnimationFrame(Game.animationId);

        Game.imagem('pause')
    }
    static changeSize() {
        Game.grid.setSize();
        Game.grid.reset()
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

        Game.fixedPieces = [];

        Game.grid.reset();
        
        Game.imagem('start')
    }

    static resume() {
        Game.state = 'running'
        Game.animationId = requestAnimationFrame(Game.loop)
    }

    static movePiece(coords) {
        if (coords.y !== 0 && Game.grid.checkCollisionY(Game.actualPiece)) {
          Game.fixarPecaAtual();
          Game.generateRandomPiece();
        } else if (coords.y !== 0 && !Game.grid.checkCollisionY(Game.actualPiece)) {
          Game.actualPiece.move(coords);
        } else if (coords.x !== 0 && !Game.grid.checkCollisionX(Game.actualPiece, coords.x)) {
          Game.actualPiece.move(coords);
        }
      }

    static fixarPecaAtual() {
        Game.fixedPieces.push(Game.actualPiece);
        Game.grid.putPiece(Game.actualPiece);
    }

    static rotatePiece() {
        Game.actualPiece.rotacionarPeca();
    }

    static imagem(type) {
        let img = new Image()
        switch (type) {
            case 'pause':
                img.src = '../images/paused_game.png'
                break;
            case 'start':
                img.src = '../images/start.png'
                break;
            
        }
        let ini_y = (canvas.height - canvas.width) / 2
        img.onload = () => ctx.drawImage(img, 0, ini_y, canvas.width, canvas.width)
    }
}

Game.reload()

document.addEventListener("keydown", e => {
    Game.controlKeys(e.key)
});