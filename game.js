// init globals
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let log = document.getElementById("log");
let logArr = [];

let view = {
    width   : 900,
    height  : 600
};

let GameStates = {
    PLAYERMOVE: 0,
    ANIMATING: 1,
    GAMEOVER: 2,
    VICTORY: 3
};
let gameState = GameStates.PLAYERMOVE;

let mousePos = { x: 0, y: 0 };
let entities = [];
let player = {};

let w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


// log //////////////////////////////////////////


let addLog = function(msg) {

    if (logArr.length >= 4) {
        logArr.pop();
    }
    logArr.unshift(msg);

    log.innerHTML = "";
    for (let logMsg of logArr) {
        log.innerHTML += logMsg + "<br/>";
    }
};

let clearLog = function() {
    log.innerHTML = "";
    logArr = [];
};


// sound utils //////////////////////////////////


let playSound = function(file, quiet) {
    let effect = new Audio(file);
    if (quiet) {
        effect.volume = 0.2;
    } else {
        effect.volume = 0.3;
    }

    effect.play();
};


// animation utils //////////////////////////////


let animationQueue = [];

let nextAnimation = function() {
    // if game ended in between animations (say attack kills player)
    // then don't bother animating anything else
    if (gameState == GameStates.GAMEOVER) {
        animationQueue = [];
    }

    if (animationQueue.length > 0) {
        gameState = GameStates.ANIMATING;
        let anim = animationQueue.pop();
        anim.start();
    } else {
        // if game state was switched to something other than animating
        // leave it, but if we're done animating and everything else is fine
        // remove the animating state
        if (gameState == GameStates.ANIMATING) {
            gameState = GameStates.PLAYERMOVE;
        }
    }
};

let queueAnimation = function(anim) {
    animationQueue.push(anim);

    // only start the next animation if not animating already
    if (gameState != GameStates.ANIMATING) {
        nextAnimation();
    }
};


// mouse utils ///////////////////////////////////


let getMousePos = function(event) {
    let rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left),
        y: (event.clientY - rect.top)
        // x: Math.floor((event.clientX - (rect.left + (tileScale / 2))) / tileSize),
        // y: Math.floor((event.clientY - (rect.top + (tileScale / 2))) / tileSize)
    };
};

canvas.addEventListener("mousemove", function(event) {
    // check if we're hovering over a mob, set his attack highlights
    mousePos = getMousePos(event);
}, false);

canvas.addEventListener("mouseup", function(event) {
    mousePos = getMousePos(event);
    addLog(mousePos.x + ", " + mousePos.y);
}, false);


// rendering /////////////////////////////////////


let drawBackground = function() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, view.width, view.height);
};

let drawEntities = function(time) {
    for (let ent of entities) {
        //ctx.drawImage(ent.img, ent.realPos.x, ent.realPos.y);
    }
};

let drawGame = function(time) {
    drawBackground();
    drawEntities(time);
};

let tick = function() {
    console.log("tick");
};


// game loop /////////////////////////////////////


let gameLoop = function(time) {
    TWEEN.update(time);
    drawGame(time);
    requestAnimationFrame(gameLoop);
};


// start it up ///////////////////////////////////

requestAnimationFrame(gameLoop);
