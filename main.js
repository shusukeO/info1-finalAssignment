//変数宣言
var canvas, info;
var run = true;
var fps = 1000 / 30;
var mouseX = 0;
var mouseY = 0;

var BLOCK_NUM = 1;
var block_x = new Array(BLOCK_NUM);
var block_y = new Array(BLOCK_NUM);
var block_alive_flag = new Array(BLOCK_NUM);
var block_frame_count = new Array(BLOCK_NUM);
var block_move_direction = new Array(BLOCK_NUM);

var block_audio = new Array(BLOCK_NUM);

var block_w = 50;
var block_h = 50;

var frameCounter = 0;

var score = 0;
var bestScore = localStorage.getItem('bestScore');
var time = 3;

var gameState = -1;

timerID = setInterval('countup()', 1000);


//main
window.onload = function () {

    //初期化
    canvas = document.getElementById('screen');
    info = document.getElementById('info');

    canvas.width = 500;
    canvas.height = 500;

    //イベント登録
    canvas.addEventListener('click', onClick, false);
    canvas.addEventListener('mousemove', mouseMove, true);
    window.addEventListener('keydown', keyDown, true);

    // 2dコンテキスト
    ctx = canvas.getContext('2d');

    var img = new Image();


    //ループ
    (function () {


        if (gameState === -1) {
            // screenクリア 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.textAlign = 'center';
            ctx.font = "30px serif";
            ctx.fillText("READY : " + time, canvas.width / 2, canvas.height / 2);

            if (time <= 0) {
                gameState = 0;
                time = 20;
            }
            //ゲーム画面
        } else if (gameState === 0) {
            info.innerHTML = "time : " + time;

            //ブロックの初期化
            for (var i = 0; i < BLOCK_NUM; i++) {
                if (block_x[i] == null) {
                    block_x[i] = Math.floor((Math.random() * canvas.width - block_w) + block_w);
                    block_y[i] = Math.floor((Math.random() * canvas.height - block_h) + block_h);
                    block_alive_flag[i] = true;
                    block_frame_count[i] = 0;

                    block_audio[i] = new Audio("./sounds/moaiSound.mp3 ");
                }

            }

            //ブロック数を増やす
            if (BLOCK_NUM < 500) {
                if (frameCounter % time == 0) {
                    BLOCK_NUM++;
                }
            }


            //ブロックの状態を調査
            for (var i = 0; i < BLOCK_NUM; i++) {
                //生きていたら
                if (block_alive_flag[i]) {

                    //音再生
                    if (run) {
                        block_audio[i].play();
                    }

                    //移動
                    //移動方向決定
                    if (block_frame_count[i] == 0) {

                        block_move_direction[i] = Math.floor((Math.random() * 4) + 1);
                        block_frame_count[i] = Math.floor((Math.random() * 5) + 5);

                    }
                    //移動
                    else {
                        switch (block_move_direction[i]) {
                            case 1:
                                if (block_x[i] < 500 - block_w) {
                                    block_x[i] += 3;
                                }
                                break;
                            case 2:
                                if (block_x[i] > 0) {
                                    block_x[i] -= 3;
                                }
                                break;
                            case 3:
                                if (block_y[i] < 500 - block_h) {
                                    block_y[i] += 3;
                                }
                                break;
                            case 4:
                                if (block_y[i] > 0) {
                                    block_y[i] -= 3;
                                }
                                break;
                        }
                        block_frame_count[i]--;
                    }

                }
            }

            //描画

            // screenクリア 
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //ブロック描画
            for (var i = 0; i < BLOCK_NUM; i++) {
                if (block_alive_flag[i]) {
                    img.src = "./images/moai.png";
                    ctx.drawImage(img, block_x[i], block_y[i], block_w, block_h);
                }
            }



            //攻撃描画
            for (var i = 0; i < BLOCK_NUM; i++) {
                if (block_alive_flag[i] === false) {
                    if (block_frame_count[i] > 0) {
                        img.src = './images/punch.png';
                        ctx.drawImage(img, block_x[i], block_y[i], block_w + 5, block_h + 5);
                        block_frame_count[i]--;
                    }
                }
            }

            //ゲーム終了処理
            if (time <= 0) {
                //ベストスコアの処理
                if (bestScore === null || bestScore < score) {
                    bestScore = score;
                    localStorage.setItem('bestScore', bestScore);
                }

                //生存フラッグを下ろす　
                for (var i = 0; i < BLOCK_NUM; i++) {
                    block_alive_flag[i] = false;
                }
                //ゲームステートの変更
                gameState = 1;
            }

            //ゲームリザルト画面
        } else if (gameState === 1) {
            ctx.textAlign = 'center';
            ctx.font = "30px serif";
            ctx.fillText("FINISH", canvas.width / 2, canvas.height / 2);
            ctx.fillText("Score : " + score, canvas.width / 2, canvas.height / 2 + 48);
            ctx.fillText("High Score : " + bestScore, canvas.width / 2, canvas.height / 2 + 48 * 2);

            if (time == 0) {
                postData(score);
                info.innerHTML = '<button onclick="window.location.reload(true);">もう一度プレイ</button>';
                time = -1;
            }

        }

        //フレーム数を増やす
        frameCounter++;
        //ロープ処理をもう一度
        if (run) { setTimeout(arguments.callee, fps); }
    })();
};

//event
function onClick(event) {
    //攻撃
    for (var i = 0; i < BLOCK_NUM; i++) {
        if (block_alive_flag[i]) {
            if (mouseX >= block_x[i] && mouseX <= block_x[i] + block_w && mouseY >= block_y[i] && mouseY <= block_y[i] + block_h) {
                block_alive_flag[i] = false;

                //モアイ音停止
                block_audio[i].pause();
                block_audio[i].currentTime = 0;

                //打撃音
                var punchSounds = ["./sounds/punch-middle2.mp3", "./sounds/punch-high1.mp3"];
                block_audio[i] = new Audio(punchSounds[Math.floor(Math.random() * punchSounds.length)]);
                block_audio[i].play();

                block_frame_count[i] = 3;

                score += 100;

            }
        }
    }
}

function mouseMove(event) {
    // マウスカーソル座標の更新
    var rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}
function keyDown(event) {
    // キーコードを取得
    var ck = event.keyCode;

    // // Spaceキーが押されていたらフラグを降ろす
    // if (ck === 32) {
    //     run = false;

    //     for (var i = 0; i < BLOCK_NUM; i++) {
    //         block_audio[i].pause();
    //         block_audio[i].currentTime = 0;
    //     }
    // }
}

function countup() {
    time--;
}

function postData(value) {

    var xhr = new XMLHttpRequest();

    xhr.open('POST', './saveData.php/');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');

    xhr.send('score=' + value);
}