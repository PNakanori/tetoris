"use strict";
// ドミノサイズ
const BLOCK_SIZE = 30;
// field size
const FIELD_COL = 10;
const FIELD_ROW = 20;
// screen size;
const SCREEN_W = FIELD_COL * BLOCK_SIZE;
const SCREEN_H = FIELD_ROW * BLOCK_SIZE;
const TETRO_Y = 0;
const TETRO_SIZE = 4;
const TETRO_X = FIELD_COL / 2 - TETRO_SIZE / 2;
// tetroの座標
let tetro_x = TETRO_X;
let tetro_y = TETRO_Y;
// tetro screen
let field = [];
// tetro speed;
const TETRO_SPEED = 500;
const can = document.getElementById("can");
const con = can.getContext("2d");
// スクリーンサイズ
can.width = SCREEN_W;
can.height = SCREEN_H;
let intervalID;
let flag = true;
let gameOver = false;
// テトロ
const TETRO_TYPES = [
    [],
    [
        [
            0,
            0,
            0,
            0
        ],
        [
            1,
            1,
            1,
            1
        ],
        [
            0,
            0,
            0,
            0
        ],
        [
            0,
            0,
            0,
            0
        ]
    ],
    [
        [
            0,
            1,
            0,
            0
        ],
        [
            0,
            1,
            0,
            0
        ],
        [
            0,
            1,
            1,
            0
        ],
        [
            0,
            0,
            0,
            0
        ]
    ],
    [
        [
            0,
            0,
            1,
            0
        ],
        [
            0,
            0,
            1,
            0
        ],
        [
            0,
            1,
            1,
            0
        ],
        [
            0,
            0,
            0,
            0
        ]
    ],
    [
        [
            0,
            1,
            0,
            0
        ],
        [
            0,
            1,
            1,
            0
        ],
        [
            0,
            1,
            0,
            0
        ],
        [
            0,
            0,
            0,
            0
        ]
    ],
    [
        [
            0,
            0,
            0,
            0
        ],
        [
            0,
            1,
            1,
            0
        ],
        [
            0,
            1,
            1,
            0
        ],
        [
            0,
            0,
            0,
            0
        ]
    ],
    [
        [
            0,
            0,
            0,
            0
        ],
        [
            1,
            1,
            0,
            0
        ],
        [
            0,
            1,
            1,
            0
        ],
        [
            0,
            0,
            0,
            0
        ]
    ],
    [
        [
            0,
            0,
            0,
            0
        ],
        [
            0,
            1,
            1,
            0
        ],
        [
            1,
            1,
            0,
            0
        ],
        [
            0,
            0,
            0,
            0
        ]
    ]
];
const TETRO_COLOR = [
    "#0000FF",
    "#008080",
    "#008000",
    "#00FF00",
    "#00FFFF",
    "#FF00FF",
    "#800080",
    "#FFFF00"
];
// random
let tetro;
let tetroColor;
// set tetro type; 
const setTetro = function() {
    let tetroType = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
    tetro = TETRO_TYPES[tetroType];
    tetroColor = TETRO_COLOR[tetroType];
};
//初期化　init() フィールドの配列を作成する
const init = function() {
    for(let y = 0; y < FIELD_ROW; y++){
        field[y] = [];
        for(let x = 0; x < FIELD_COL; x++)field[y][x] = 0;
    }
};
// ブロック１つを描画する
const drawBlock = function(x, y, NewTetro_X, NewTetro_Y) {
    // con.clearRect(0,0,SCREEN_W,SCREEN_H);
    // console.log(NewTetro_X * BLOCK_SIZE + x * BLOCK_SIZE,NewTetro_Y * BLOCK_SIZE + y * BLOCK_SIZE)
    con.fillStyle = tetroColor;
    con.fillRect(NewTetro_X * BLOCK_SIZE + x * BLOCK_SIZE, NewTetro_Y * BLOCK_SIZE + y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    con.strokeStyle = "black";
    con.strokeRect(NewTetro_X * BLOCK_SIZE + x * BLOCK_SIZE, NewTetro_Y * BLOCK_SIZE + y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    con.strokeRect(0, 0, SCREEN_W, SCREEN_H);
};
// 全部描画する  clear Rect して　
const drawTetro = function() {
    con.clearRect(0, 0, SCREEN_W, SCREEN_H);
    for(let y = 0; y < TETRO_SIZE; y++){
        for(let x = 0; x < TETRO_SIZE; x++)if (tetro[y][x]) drawBlock(x, y, tetro_x, tetro_y);
    }
    for(let y = 0; y < FIELD_ROW; y++){
        for(let x = 0; x < FIELD_COL; x++)if (field[y][x]) drawBlock(x, y, 0, 0);
    }
};
// ブラックの衝突判定
const checkTetro = function(i, m, newTetro) {
    if (!newTetro) newTetro = tetro;
    let NewTetro_X = tetro_x + i;
    let NewTetro_Y = tetro_y + m;
    for(let y = 0; y < TETRO_SIZE; y++){
        for(let x = 0; x < TETRO_SIZE; x++)if (newTetro[y][x]) {
            if (NewTetro_Y + y > FIELD_ROW - 1 || NewTetro_X + x < 0 || NewTetro_X + x > FIELD_COL - 1 || field[NewTetro_Y + y][NewTetro_X + x]) return false;
        }
    }
    return true;
};
// てとろの回転
const turnTetro = function() {
    let newTetro = [];
    for(let y = 0; y < TETRO_SIZE; y++){
        newTetro[y] = [];
        for(let x = 0; x < TETRO_SIZE; x++)newTetro[y][x] = tetro[TETRO_SIZE - 1 - x][y];
    }
    return newTetro;
};
// てトロの固定
const fixTetro = function() {
    for(let y = 0; y < TETRO_SIZE; y++){
        for(let x = 0; x < TETRO_SIZE; x++)if (tetro[y][x]) field[tetro_y + y][tetro_x + x] = 1;
    }
    drawTetro();
};
// ラインが揃ったかチェックして消す
const deleteLine = function() {
    for(let y = 0; y < FIELD_ROW; y++){
        let linecheck = 0;
        for(let x = 0; x < FIELD_COL; x++)if (field[y][x]) linecheck++;
        if (linecheck === 10) {
            for(let ny = y; ny > 1; ny--)for(let nx = 0; nx < FIELD_COL; nx++)field[ny][nx] = field[ny - 1][nx];
            linecheck = 0;
        }
    }
};
// ブロックの落ちる処理
const dropTetro = function() {
    console.log(TETRO_Y);
    console.log(field[TETRO_Y][TETRO_X]);
    if (field[TETRO_Y][TETRO_X]) {
        console.log(tetro_y & "\uD83D\uDC90");
        gameOver = true;
        return;
    }
    if (!checkTetro(0, 1)) {
        fixTetro();
        deleteLine();
        tetro_x = TETRO_X;
        tetro_y = TETRO_Y;
        setTetro();
    }
    tetro_y++;
    drawTetro();
};
// キーボードが押された時の処理
window.addEventListener("keydown", function(e) {
    switch(e.key){
        // up
        // case  'ArrowUp':
        //     checkTetro(0,-1);
        //     tetro_y--;
        //     drawTetro();
        //     break;
        // right
        case "ArrowRight":
            if (checkTetro(1, 0)) tetro_x++;
            drawTetro();
            break;
        // down
        case "ArrowDown":
            dropTetro();
            break;
        // left   
        case "ArrowLeft":
            if (checkTetro(-1, 0)) tetro_x--;
            drawTetro();
            break;
        // turn 
        case " ":
            let newTetro = turnTetro();
            if (checkTetro(0, 0, newTetro)) tetro = newTetro;
            drawTetro();
            break;
    }
});
const startTetro = function() {
    setTetro();
    intervalID = setInterval(function() {
        if (gameOver) {
            clearInterval(intervalID);
            alert("GAME OVER");
        }
        dropTetro();
        deleteLine();
    // dropTetro()   ;
    }, TETRO_SPEED);
};
// init に入れる　
init();
// drawTetro();
startTetro(); // if(gameOver){
 //     clearInterval(intervalID);
 //  }

//# sourceMappingURL=index.c4775257.js.map
