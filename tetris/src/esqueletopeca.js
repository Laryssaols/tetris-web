class Peca {
    constructor(tipo, cols, rows) {
        this.tipo = tipo;
        this.cols = cols;
        this.rows = rows;
        this.especial = false;
        this.cor = undefined;
        this.initPeca();
    }

    initPeca() {
        switch (this.tipo) {
            case 0: 
                // O
                // O
                // O
                // O 
                this.forma = [
                    {x:0,y:0},  
                    {x:0,y:1},
                    {x:0,y:2},
                    {x:0,y:3},
                ];
                this.cor = "rgb(255, 64, 0)";
                break;
            case 1:
                // OO
                // OO
                this.forma = [
                    {x:0,y:0},
                    {x:0,y:1},
                    {x:1,y:0},
                    {x:1,y:1},
                ];
                this.cor = "rgb(15, 255, 59)"
                break;
            case 2: 
                // O
                // O
                // OO 
                this.forma = [
                    {x:0,y:0},
                    {x:0,y:1},
                    {x:0,y:2},
                    {x:1,y:2},
                ];
                this.cor = "blue";
                break;
            case 3: 
                //  O
                //  O
                // OO
                this.forma = [
                    {x:0,y:2},
                    {x:1,y:0},
                    {x:1,y:1},
                    {x:1,y:2},
                ];
                this.cor = "rgb(230, 35, 230)";
                break;
            case 4: 
                //  O
                // OOO
                this.forma = [
                    {x:0,y:1},
                    {x:1,y:0},
                    {x:1,y:1},
                    {x:2,y:1},
                ];
                this.cor = "yellow";
                break;
            case 5:
                // O O
                // OOO
                this.forma = [
                    {x:0,y:0},
                    {x:0,y:1},
                    {x:1,y:1},
                    {x:2,y:0},
                    {x:2,y:1},
                ];
                this.cor = "cyan";
                break;
            case -1:
                // O 
                this.especial = true;
                this.forma = [
                    {x:0,y:0},
                ];
                this.cor = "white";
                break;
            default:
                break;
        }
    }

    rotacionarPeca() {  

        const pontoDeRotacao = this.forma[0];

        const novaForma = this.forma.map(coord => ({ x: coord.x, y: coord.y }));
        
        for (const coord of novaForma) {
          
            const translatedX = coord.x - pontoDeRotacao.x;
            const translatedY = coord.y - pontoDeRotacao.y;
    
            const rotatedX = -translatedY;
            const rotatedY = translatedX;
    
            coord.x = rotatedX + pontoDeRotacao.x;
            coord.y = rotatedY + pontoDeRotacao.y;
    
            // Verifica se as coordenadas ultrapassam os limites do grid
            if (coord.x < 0 || coord.x >= this.cols || coord.y >= this.rows || coord.y < 0) {
                return;
            }
        }
    
        // Se todas as novas coordenadas estiverem dentro dos limites do grid a rotação é feita
        this.forma = novaForma;
    }

    move(posicao) {
        this.forma.forEach(el => {
            el.x += posicao.x;
            el.y += posicao.y;
        })
    }

    inverteHorizontal(x_size) {
        this.forma.forEach(el => {
            // Inverte a posição X
            el.x = ((x_size - 1) - el.x);
            
            // Verifica se a peça está saindo do grid após a inversão e ajusta se for necesário
            if (el.x < 0) {
                el.x = 0; // Define a posição X como 0 se for menor que 0
            } else if (el.x >= x_size) {
                el.x = x_size - 1; // Define a posição X como a borda direita do grid, se for maior ou igual a x_size
            }
        })
    }

    static getCor(type) {
        let peca = new Peca(type)
        return peca.cor;
    }
}    