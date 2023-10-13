"use strict"
const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
//const timeElement = document.getElementById("time");
const lineElement = document.getElementById("line");

if (!localStorage.getItem('tamanhoTabuleiro')) {
    localStorage.setItem('tamanhoTabuleiro', '1')
}

let debug = true;

function drawSquare(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, size - 2, size - 2)
}

class Grid {
    constructor(size, cols, rows) {
        this.size = size;
        this.cols = cols;
        this.rows = rows;
        this.grid = [];
        this.setSize();
        this.reset();
    }

    newRow() {
        return new Array(this.cols).fill(null);
    }

    drawGrid() {
        this.grid.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col != null) {
                    drawSquare(x * this.size, y * this.size, this.size, Peca.getCor(col))
                }
            })
        })
    }

    putPiece(piece) {
        piece.forma.forEach(el => {
            if (el.y >= 0 && el.y < this.grid.length && el.x >= 0 && el.x < this.grid[el.y].length) {
                this.grid[el.y][el.x] = piece.tipo;
            }
        });
    }
    
    checkCollisionY(piece) {
        return piece.forma.some(el => {
            if ((el.y + 1) >= this.grid.length ) {
                return true;
            } else if (this.grid[el.y + 1][el.x] != null)
                return true;
        });
    }

    checkCollisionX(piece, direction) {
        return piece.forma.some(el => {
            const newX = el.x + direction;
            if(newX < 0 || newX >= this.cols) {
                return true;
            } else if (this.grid[el.y][newX] != null) {
                return true;
            }
        });
    }

    //Verifica se alguma linha foi completada
    verificaLinhasCompletas() {
        let linhasCompletas = this.grid.map((row, index) => {
            if (!row.includes(null)) {
                if (row.includes(-1)) {
                    Game.inverteHorizontal()
                }
                return index;
            }
            return null;
        });
        linhasCompletas = linhasCompletas.filter(row => row != null)
        this.excluirLinhas(linhasCompletas)
        return linhasCompletas.length;
    }

    //Exclui a linha 
    excluirLinhas(linhasCompletas) {
        if (linhasCompletas.length < 1) {
            return false
        }
    
        linhasCompletas.forEach(linha => {
            this.grid.splice(linha, 1);
            this.grid.unshift(this.newRow())
        });

        return true;
    }  

    inverteHorizontal() {
        this.grid = this.grid.map(row => {
            for (let i = 0; i <= Math.ceil((row.length) / 2); i++) {
                let aux = row[i]
                row[i] = row[(row.length - 1)-i]
                row[(row.length - 1)-i] = aux
            }
            return row
        })
    }

    setSize() {
        let type = localStorage.getItem("tamanhoTabuleiro");
        if ( type === '1') {
            this.rows = 20;
            this.cols = 10;
            this.size = 20;
            localStorage.setItem('tamanhoTabuleiro', '1');
        } else {
            this.rows = 44;
            this.cols = 22;
            this.size = 10;
            localStorage.setItem('tamanhoTabuleiro', '2');
        }
        canvas.width = this.cols * this.size;
        canvas.height = this.rows * this.size;
    }
    
    reset() {
        this.grid = []
        for (let i = 0; i < this.rows; i++) {
            let row = this.newRow()
            this.grid.push(row);
        }
    }
}

class Game {
    static animationId = undefined;
    static frame = 0;
    static frameWait = 15;
    static grid = new Grid();
    static actualPiece = null;
    static fixedPieces = [];
    static linhas = 0;
    static image = null;
    static state = undefined;   // Rodando (running), Pausado (paused), 
                                // finalizado (ended), antes de rodar (undefined)
    static numScore = 0;

    static start() {
        Game.state = 'running';

        Game.generateRandomPiece();

        return Game.animationId = requestAnimationFrame(Game.loop);
    }

        //Verifica se tem uma peca especial na linha
        static temPecaEspecial(row) {
            for (const color of row) {
                if (color !== 'white') {
                    return true;
                }
            }
            return false;
        }

    /* //Verifica se a linha excluida tem uma peca especial, se sim, o tabuleiro deve ficar espelhado
    static tabuleiroEspelhado(linhasExcluidas) {
        let espelhado = false; 
        for (const linha of linhasExcluidas) {
            const row = Game.grid[linha];
            if (row.every(cell => cell !== null)) {
                if (this.temPecaEspecial(row)) {
                    espelhado = true; // Se houver uma peça especial, o tabuleiro deve ser espelhado
                }
            }
        }
        if (espelhado) {
            Game.grid.inverteHorizontal();
            Game.actualPiece.inverteHorizontal(Game.grid.cols);
            for (const piece of Game.fixedPieces) {
                piece.inverteHorizontal(Game.grid.cols);
            }
        }
    } */

    static loop() {
        if (Game.frame < Game.frameWait) {
            Game.frame++;
            return Game.animationId = requestAnimationFrame(Game.loop);
        }
        Game.frame = 0;

        Game.VerificaPreenchimentoLinhaEAtualizaDados();

        Game.resetCanvas();

        Game.drawBackgroundPieces();

        Game.drawPiece(Game.actualPiece);

        Game.movePiece({x: 0, y: 1});

        true ? Game.animationId = requestAnimationFrame(Game.loop) : undefined;
    }

    static drawBackgroundPieces() {
        Game.grid.drawGrid();
    }

    

    static VerificaPreenchimentoLinhaEAtualizaDados() {
        let linhasDeletadas = Game.grid.verificaLinhasCompletas();
        
        if (linhasDeletadas < 1) { return; }
        
        alert(linhasDeletadas);
        
        Game.linhas += linhasDeletadas;

        Game.numScore += linhasDeletadas * 10; //bonus

        Game.atualizaDados()
    }

    static atualizaDados() {
        scoreElement.innerText = Game.numScore;

        lineElement.innerText = Game.linhas;
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
    }

    static drawPiece(piece) {
        
        piece.forma.forEach(el => {
            let {x, y} = el;
            let size = Game.grid.size
            let ini_x = (x * size);
            let ini_y = (y * size);
    
            drawSquare(ini_x, ini_y, size, piece.cor);
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
                else if (key === 'ArrowDown') {
                    Game.movePiece({x: 0, y:1})
                    // Game.checkCollisionX(Game.actualPiece);
                    // Game.checkCollisionY(Game.actualPiece);
                }
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
        Game.imagem('pause');
    }
    static changeSize() {
        Game.grid.setSize();
        Game.grid.reset();
        Game.resetCanvas();
        Game.imagem('start');
    }

    static reload(){
        Game.state = undefined;
        
        Game.numScore = 0;

        Game.linhas = 0;

        Game.atualizaDados()

        if (Game.animationId != undefined) {
            cancelAnimationFrame(Game.animationId);
            Game.animationId = undefined;
        }

        Game.resetCanvas();

        Game.fixedPieces = [];
        
        Game.grid.reset();
        
        Game.imagem('start');
    }

    static resume() {
        Game.state = 'running';
        Game.animationId = requestAnimationFrame(Game.loop);
    }

    static movePiece(coords) {
        if (coords.y !=0 && Game.grid.checkCollisionY(Game.actualPiece)) {
            Game.fixarPecaAtual();
            Game.generateRandomPiece();
        } else if (coords.y != 0 && !Game.grid.checkCollisionY(Game.actualPiece)) {
            Game.actualPiece.move(coords);
        } else if (coords.x != 0 && !Game.grid.checkCollisionX(Game.actualPiece, coords.x)) {
            Game.actualPiece.move(coords);
        } /* else if(nextY < 0) {
            Game.gameOver();
        } */
    }

    static fixarPecaAtual() {
        if (Game.state === 'running') {
            const occupiedCoordinates = Game.actualPiece.forma.map((coord) => {
                const x = coord.x;
                const y = coord.y;
                return { x, y };
            });
    
            if (occupiedCoordinates.some((coord) => coord.y === 0)) {
                Game.gameOver();
                return;
            }
    
            Game.fixedPieces.push(Game.actualPiece);
            Game.grid.putPiece(Game.actualPiece);

        }
    }

    static rotatePiece() {
        if (Game.state === 'running') {
            // Salva a posição atual da peça antes
            const oldForma = Game.actualPiece.forma;
    
            // Tenta rotacionar a peça
            Game.actualPiece.rotacionarPeca();
    
            // Verifica se a rotação é possível para determinada posição
            if (Game.grid.checkCollisionY(Game.actualPiece) || Game.grid.checkCollisionX(Game.actualPiece, 0)) {

                Game.actualPiece.forma = oldForma;
            }
        }
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