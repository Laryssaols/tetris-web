"use strict"
const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const lineElement = document.getElementById("line");
const levelElement = document.getElementById("level");
const timerElement = document.getElementById("timer");

if (!localStorage.getItem('tamanhoTabuleiro')) {
    localStorage.setItem('tamanhoTabuleiro', '1')
}

var DEBUG = false;

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

    checkCollisionY(piece) {
        return piece.forma.some(el => {
            if ((el.y + 1) >= this.grid.length ) {
                return true;
            } else if (this.grid[el.y + 1][el.x] != null)
                return true;
        });
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

    newRow() {
        return new Array(this.cols).fill(null);
    }

    inverteHorizontal() {
        this.grid = this.grid.map(row => {
            for (let i = 0; i < Math.floor((row.length) / 2); i++) {
                let aux = row[i]
                row[i] = row[(row.length - 1)-i]
                row[(row.length - 1)-i] = aux
            }
            return row
        })
    }

    putPiece(piece) {
        piece.forma.forEach(el => {
            if (el.y >= 0 && el.y < this.grid.length && el.x >= 0 && el.x < this.grid[el.y].length) {
                this.grid[el.y][el.x] = piece.tipo;
            }
        });
    }

    reset() {
        this.grid = []
        for (let i = 0; i < this.rows; i++) {
            let row = this.newRow()
            this.grid.push(row);
        }
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

    //Verifica se alguma linha foi completada
    verificaLinhasCompletas() {
        let linhasCompletas = this.grid.map((row, index) => {
            if (!row.includes(null)) {
                if (row.includes(-1)) {
                    Game.inverteHorizontal()
                }
                console.count();
                return index;
            }
            return null;
        });
        linhasCompletas = linhasCompletas.filter(row => row != null)
        console.warn(`Numero de linhas completadas e removidas: ${linhasCompletas.length}`);
        this.excluirLinhas(linhasCompletas)
        return linhasCompletas.length;
    }  
}


class Game {
    static actualPiece = null;
    static animationId = undefined;
    static frame = 0;
    static frameWait = 20;
    static grid = new Grid();
    static image = null;
    static inverted = false
    static lastNumLinhas = 0;
    static linhas = 0;
    static nivel = 0;
    static numPecasGeradas = 0;
    static numScore = 0;
    // Rodando (running), Pausado (paused), 
    // finalizado (ended), antes de rodar (undefined)
    static state = undefined;   
    static timer = { id: undefined, seg: 0, min: 0, }

    static atualizaDados() {
        let segundos = Game.timer.seg < 10 ? `0${Game.timer.seg}` : Game.timer.seg;
        let minutos = Game.timer.min < 10 ? `0${Game.timer.min}` : Game.timer.min;

        timerElement.innerText = `${minutos}:${segundos}`
        scoreElement.innerText = Game.numScore;
        lineElement.innerText = Game.linhas;
        levelElement.innerText = Game.nivel;
    }

    static aumentaNivel() {
        Game.nivel++;
        Game.frameWait > 0 ? Game.frameWait-- : undefined;
    }

    static changeSize() {
        Game.grid.setSize();
        Game.grid.reset();
        Game.resetCanvas();
        Game.imagem('start');
    }

    static controlKeys(key) {
        switch (Game.state) {
            case 'running':
                if (key === 'Escape') {
                    Game.pause();
                }
                else if (key === 'ArrowUp') {
                    Game.rotatePiece();
                }
                else if (key === 'ArrowLeft') {
                    let xMv = Game.inverted ? 1 : -1;
                    Game.movePiece({x: xMv, y: 0})
                }
                else if (key === 'ArrowRight') {
                    let xMv = Game.inverted ? -1 : 1;
                    Game.movePiece({x: xMv, y:0})
                }
                else if (key === 'ArrowDown') {
                    Game.movePiece({x: 0, y:1})
                }
                else if (key === 'i' && DEBUG) {
                    Game.inverteHorizontal()
                }
                break;
            case 'paused':
                if (key === 'Escape' || key === 'Enter') {
                    Game.resume()
                }
                else if (key === 'i' && DEBUG) {
                    Game.inverteHorizontal()
                }
                break;
            case 'ended':
                if (key === 'Enter') {
                    Game.reload()
                    Game.start()
                }
                else if (key === 's' && DEBUG) {
                    Game.changeSize()
                }
                break;
            default:
                if (key === 'Enter') {
                    Game.start()
                }
                else if (key === 's' && DEBUG) {
                    Game.changeSize()
                }
                break;
        }
        if (key === 'r') {
            Game.reload()
        }
    }

    static drawBackgroundPieces() {
        Game.grid.drawGrid();
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

    static fixarPecaAtual() {
        if (Game.state === 'running') {
            let occupiedCoordinates = Game.actualPiece.forma.map((coord) => {
                let {x, y} = coord;
                return {x, y};
            });
            
            if (occupiedCoordinates.some((coord) => coord.y === 0)) {
                Game.gameOver();
                return;
            }
            
            Game.grid.putPiece(Game.actualPiece);
        }
    }

    static gameOver() {
        
        Game.state = 'ended';
        
        cancelAnimationFrame(Game.animationId);
        
        Game.imagem('ended')
    }

    static generateRandomPiece() {
        let num = Math.floor(Math.random() * 7)
        
        num = (num != 6 ? num : -1)
        
        Game.actualPiece = new Peca(num)

        Game.numPecasGeradas++;
        
        let ini_x = Math.ceil(Game.grid.cols/2)
        
        Game.movePiece({x: ini_x, y: 0}, true);
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
            case 'ended':
                img.src = '../images/gameover.png'
                break;
        }
        let ini_y = (canvas.height - canvas.width) / 2
        img.onload = () => ctx.drawImage(img, 0, ini_y, canvas.width, canvas.width)
    }

    static inverteHorizontal() {
        Game.inverted = Game.inverted ? false : true;
        Game.grid.inverteHorizontal();
        Game.actualPiece.inverteHorizontal(Game.grid.cols);
    }

    static loop() {
        if (Game.frame < Game.frameWait) {
            Game.frame++;
            return Game.animationId = requestAnimationFrame(Game.loop);
        }
        Game.frame = 0;
        
        Game.verificaPreenchimentoLinhaEAtualizaDados();
        
        Game.resetCanvas();
        
        Game.drawBackgroundPieces();
        
        Game.drawPiece(Game.actualPiece);

        Game.movePiece({x: 0, y: 1});
        
        Game.state != 'ended' ? Game.animationId = requestAnimationFrame(Game.loop) : undefined;
    }

    static movePiece(coords, isNew) {
        if (coords.y !=0) {
            if (Game.grid.checkCollisionY(Game.actualPiece)) {
                Game.fixarPecaAtual();
                Game.generateRandomPiece();
            } else {
                Game.actualPiece.move(coords);
            }
        } else if (coords.x != 0) {
            if (!Game.grid.checkCollisionX(Game.actualPiece, coords.x)) {
                Game.actualPiece.move(coords);
            } else if (isNew) {
                Game.actualPiece.move(coords);
                Game.grid.checkCollisionY(Game.actualPiece);
            }
        }
    }

    static start() {
        Game.state = 'running';

        Game.runTimer()
        
        Game.generateRandomPiece();
        
        return Game.animationId = requestAnimationFrame(Game.loop);
    }

    static pause() {

        if (Game.state != 'running') { return };
        
        Game.state = 'paused';
        
        cancelAnimationFrame(Game.animationId);
        
        Game.imagem('pause');

        clearInterval(Game.timer.id)
    }

    static reload(){
        if (Game.animationId != undefined) {
            cancelAnimationFrame(Game.animationId);
            Game.animationId = undefined;
        }

        clearInterval(Game.timer.id);
        
        Game.state = undefined;
        
        Game.numScore = 0;
        
        Game.linhas = 0;

        Game.nivel = 0;

        Game.inverted = false;

        Game.timer = {id: undefined, seg: 0, min: 0}

        Game.atualizaDados()
        
        Game.resetCanvas();
        
        Game.grid.reset();
        
        Game.imagem('start');
    }

    static resetCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    static resume() {
        Game.state = 'running';

        Game.runTimer()

        Game.animationId = requestAnimationFrame(Game.loop);
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

    //Verifica se tem uma peca especial na linha
    static temPecaEspecial(row) {
        for (const color of row) {
            if (color !== 'white') {
                return true;
            }
        }
        return false;
    }

    static runTimer() {
        Game.timer.id = setInterval(() => {
            let segundos = Game.timer.seg < 10 ? `0${Game.timer.seg}` : Game.timer.seg;
            let minutos = Game.timer.min < 10 ? `0${Game.timer.min}` : Game.timer.min;
            
            timerElement.innerText = `${minutos}:${segundos}`
            
            if (Game.timer.seg % 60 == 0 && Game.timer.seg > 0) {
                Game.timer.min++;
                Game.timer.seg = 0;
            }
            
            Game.timer.seg++
        }, 1000); 
    }

    static verificaPreenchimentoLinhaEAtualizaDados() {
        let linhasDeletadas = Game.grid.verificaLinhasCompletas();
        
        if (linhasDeletadas < 1) { return; }
        
        Game.linhas += linhasDeletadas;

        
        Game.numScore += linhasDeletadas * 10; //bonus
        
        if (Game.linhas > 0 && Game.linhas - Game.lastNumLinhas >= 10) { 
            Game.aumentaNivel();
            Game.lastNumLinhas += 10;
        }
        

        Game.atualizaDados()
    }
}

Game.reload()

document.addEventListener("keydown", e => {
    Game.controlKeys(e.key)
});
