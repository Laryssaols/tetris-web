/* const I = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ],
];

const J = [
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
    ],
];

const L = [
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
    ],
];

const O = [
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ]
];


const T = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
    ],
];

const E = [
    [
        [1, 1, 0],
        [1, 0, 0],
        [1, 1, 0],
    ],
    [
        [1, 1, 1],
        [1, 0, 1],
        [0, 0, 0],
    ],
    [
        [0, 1, 1],
        [0, 0, 1],
        [0, 1, 1],
    ],
    [
        [0, 0, 0],
        [1, 0, 1],
        [1, 1, 1],
    ],
];

//peça especial
const S = [
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
    ],
    [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
    ],
    [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
    ],
];
const PIECES = [
    [E, 'green', 'e.png']
    [S, 'pink', 's.png'],
    [T, 'yellow','t.png'],
    [O, 'blue', 'o.png'],
    [L, 'purple','l.png'],
    [I, 'cyan', 'i.png'],
    [J, 'orange','j.png'],
];

const readableLevel = {
    '500': 'SLOW',
    '480': '2',
    '460': '3',
    '440': '4',
    '420': '5',
    '400': '6',
    '380': '7',
    '360': '8',
    '340': '9',
    '320': '10',
    '300': '11',
    '280': '12',
    '260': '13',
    '240': '14',
    '220': '15',
    '200': '16',
    '180': '17',
    '160': '18',
    '140': '19',
    '120': '20',
    '100': 'FULL SPEED'
};

class Peca {
    constructor (tipo) {

    }
} */


class Peca {
    constructor(tipo) {
        this.tipo = tipo;
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
        let pontoDeRotacao = {
            x: this.forma[0].x,
            y: this.forma[0].y
        }

        // Aplicar a transformação de rotação a cada coordenada da forma
        for (const coord of this.forma) {
            // Translação para o ponto de rotação
            const translatedX = coord.x - pontoDeRotacao.x;
            const translatedY = coord.y - pontoDeRotacao.y;
    
            // Fórmula de rotação 90 graus no sentido anti-horário
            const rotatedX = -translatedY;
            const rotatedY = translatedX;
    
            // Translação de volta ao ponto original
            coord.x = rotatedX + pontoDeRotacao.x;
            coord.y = rotatedY + pontoDeRotacao.y;
        }
    }   

    move(posicao) {
        this.forma.forEach(el => {
            el.x += posicao.x;
            el.y += posicao.y;
        })
    }

    inverteHorizontal(x_size) {
        this.forma.forEach(el => {
            el.x = ((x_size - 1) - el.x)
        })
    }
}