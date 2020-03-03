var stage = new PIXI.Container();
var graphics = new PIXI.Graphics();
var renderer = PIXI.autoDetectRenderer(200, 200, { backgroundColor: 0x000000 });
renderer.resize(window.innerWidth, window.innerHeight - 4);
document.body.appendChild(renderer.view);

stage.addChild(graphics);

var yvel;
var nodes;
var screenWidth;
var screenHeight;
var boardW;
var boardH;
var nodeSize;

init();
function init() {
    yvel = 0;
    nodes = [];
    boardW = 39;
    boardH = 20;
    for (var i = 0; i < boardW; i++) {
        nodes[i] = [];
    }
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight - 4;
    nodeSize = screenHeight / boardH;
    for (var i = 0; i < boardW; i++) {   //fill nodes with node objects
        for (var j = 0; j < boardH; j++) {   //fill nodes with node objects
            nodes[i][j] = (new Node(i * nodeSize, j * nodeSize, Math.floor(Math.random() * 16777215)));

        }
    }

    loop(); //just render graphics on load instantly
    var myVar = setInterval(loop, 500); //cause game loop to iterate every 500ms
}

function update(progress) {
    yvel += 2;
}

function draw() {
    graphics.clear();

    for (var i = 0; i < nodes.length; i++) {   //draw every node each game loop
        for (var j = 0; j < nodes[1].length; j++) {
            nodes[i][j].color = Math.floor(Math.random() * 16777215);
            nodes[i][j].display();
        }
    }

    graphics.beginFill(0x9b59b6); // Purple
    graphics.drawRect(600, yvel, 25, 25); // drawRect(x, y, width, height)
    graphics.endFill();
}

function loop(progress) {
    update(progress);
    draw();
    renderer.render(stage);
}


//The object Node will make up the board
function Node(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;

    this.display = function () {
        graphics.beginFill(this.color); // Purple
        graphics.drawRect(this.x, this.y, nodeSize, nodeSize); // drawRect(x, y, width, height)
        graphics.endFill();
    }
}
