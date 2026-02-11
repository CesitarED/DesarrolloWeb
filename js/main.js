var c = document.getElementById("myArkanoid");
var ctx = c.getContext("2d");

var radius = 10;
var puntoX = c.width / 2;
var puntoY = c.height - 10;

var dx = 2;
var dy = -2;

var paddlex = c.width / 3;
var paddley = c.height - 10;
var paddleW = 60;
var paddleH = 12;

var rightMove = false;
var leftMove = false;

var brickRows = 3;
var brickColums = 5;

var brickWidth = 60;
var brickHeight = 20;

var brickPadding = 12;
var brickOffsetTop = 30;
var brickOffsetLeft = 100;

var bricks = [];

for (let i = 0; i < brickColums; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickRows; j++) {
        bricks[i][j] = {
            x: 0,
            y: 0,
            drawBrick: true,
            type: Math.random() > 0.8 ? 'special' : 'normal' // 20% ladrillos especiales y 80% de ser ladrillos normales
        };
    }
}

var score = 0;
var lives = 3;
var level = 1;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 37) {
        leftMove = true;
    }
    else {
        if (e.keyCode == 39) {
            rightMove = true;
        }
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 37) {
        leftMove = false;
    } else {
        if (e.keyCode == 39) {
            rightMove = false;
        }
    }
}

function mouseMoveHandler(e) {
    var mouseRelativex = e.clientX - c.offsetLeft;
    if (mouseRelativex > 0 && mouseRelativex < c.width) {
        paddlex = mouseRelativex - paddleW / 2;
    }
}

console.log("mi variable puntoX es : " + puntoX);
console.log("mi variable puntoY es : " + puntoY);
console.log("mi variable radius es : " + radius);

function drawBall() {
    ctx.beginPath();
    ctx.arc(puntoX, puntoY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = "#0066cc";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddlex, paddley, paddleW, paddleH);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let i = 0; i < brickColums; i++) {
        for (let j = 0; j < brickRows; j++) {
            if (bricks[i][j].drawBrick) {
                var bx = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
                var by = (j * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[i][j].x = bx;
                bricks[i][j].y = by;
                ctx.beginPath();
                ctx.rect(bx, by, brickWidth, brickHeight);
                // Colorea diferente los ladrillos especiales en este caso los dejaremos en color amarillo por el constraste con el fondo :D
                ctx.fillStyle = bricks[i][j].type == 'special' ? "#ffcc00" : "#ffffff";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function detectHits() {
    for (let i = 0; i < brickColums; i++) {
        for (let j = 0; j < brickRows; j++) {
            var brick = bricks[i][j];
            if (bricks[i][j].drawBrick) {
                if (puntoX > brick.x && puntoX < brick.x + brickWidth
                    && puntoY > brick.y && puntoY < brick.y + brickHeight) {

                    // Detecta desde qué lado golpea para que el rebote sea un pcoo mejor y realista y no se vea tosco
                    var fromTop = Math.abs(puntoY - brick.y);
                    var fromBottom = Math.abs(puntoY - (brick.y + brickHeight));
                    var fromLeft = Math.abs(puntoX - brick.x);
                    var fromRight = Math.abs(puntoX - (brick.x + brickWidth));

                    var min = Math.min(fromTop, fromBottom, fromLeft, fromRight);

                    if (min == fromTop || min == fromBottom) {
                        dy = -dy;
                    } else {
                        dx = -dx;
                    }

                    brick.drawBrick = false;

                    // Bonus para ladrillos especiales para que la plataforma sea un poco mas amplia temporalmente
                    if (brick.type == 'special') {
                        score += 3;
                        // Paddle más ancho temporalmente
                        paddleW += 15;
                        setTimeout(() => { paddleW = 60; }, 5000);
                    } else {
                        score++;
                    }

                    // Aumenta velocidad de la bola cada 5 ladrillos golpeados
                    if (score % 5 == 0) {
                        dx *= 1.05;
                        dy *= 1.05;
                    }

                    // Verifica si ganó el nivel para pasar al siguiente nivel
                    if (score >= brickColums * brickRows * level) {
                        nextLevel();
                    }
                }
            }
        }
    }
}

function nextLevel() {
    level++;
    alert("¡Nivel " + level + "!");

    // Aumenta dificultad generando mas ladrillos
    if (brickRows < 6) {
        brickRows++;
    }

    // Reinicia ladrillos
    bricks = [];
    for (let i = 0; i < brickColums; i++) {
        bricks[i] = [];
        for (let j = 0; j < brickRows; j++) {
            bricks[i][j] = {
                x: 0,
                y: 0,
                drawBrick: true,
                type: Math.random() > 0.8 ? 'special' : 'normal'
            };
        }
    }

    // Reinicia bola
    puntoX = c.width / 2;
    puntoY = c.height - 10;
    dx = 2 + (level * 0.3);
    dy = -2 - (level * 0.3);
    paddlex = c.width / 2;
}

function drawScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0033cc";
    ctx.fillText("Score: " + score, 10, 20);
}

function drawLives() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0033cc";
    ctx.fillText("Lives: " + lives, c.width - 100, 20);
}

function drawLevel() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0033cc";
    ctx.fillText("Level: " + level, c.width / 2 - 30, 20);
}

function shake() {
    c.style.transform = 'translate(' + (Math.random() * 10 - 5) + 'px,' + (Math.random() * 10 - 5) + 'px)';
    setTimeout(() => { c.style.transform = ''; }, 200);
}

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    drawPaddle();
    drawBall();
    drawBricks();
    detectHits();
    drawScore();
    drawLives();
    drawLevel();
    if (puntoX + dx > c.width - radius || puntoX + dx < radius) {
        dx = -dx;
    }
    if (puntoY + dy < radius) {
        dy = -dy;
    } else {
        if (puntoY + dy > c.height - radius) {
            if (puntoX > paddlex && puntoX < paddlex + paddleW) {
                // Rebote con ángulo según dónde golpee el paddle
                var hitPos = (puntoX - paddlex) / paddleW;
                var angle = (hitPos - 0.5) * Math.PI / 3;
                var speed = Math.sqrt(dx * dx + dy * dy);
                dx = speed * Math.sin(angle);
                dy = -speed * Math.cos(angle);
            } else {
                lives--;
                shake();
                if (lives < 1) {
                    gameOver();
                    return;
                } else {
                    puntoX = c.width / 2;
                    puntoY = c.height - 10;
                    dx = 2;
                    dy = -2;
                    paddlex = c.width / 2;
                }
            }
        }
    }

    // Movimiento del paddle más rápido
    if (leftMove && paddlex > 0) {
        paddlex -= 12;
    }
    if (rightMove && paddlex < (c.width - paddleW)) {
        paddlex += 12;
    }

    puntoX += dx;
    puntoY += dy;
    requestAnimationFrame(draw);
}

function gameOver() {
    document.getElementById("myArkanoidGameOver").style.display = "block";
}

draw();