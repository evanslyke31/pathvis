var stage = new PIXI.Container();
var graphics = new PIXI.Graphics();
var renderer = PIXI.autoDetectRenderer(200, 200,{backgroundColor : 0x000000});
renderer.resize(window.innerWidth,window.innerHeight - 4);
document.body.appendChild(renderer.view);

stage.addChild(graphics);

var yvel;
var nodes;

init();
function init() {
    yvel = 0;
    nodes = [];
    for(var i = 0; i < 20; i++) {   //fill nodes with node objects
        for(var j = 0; j < 20; j++) {   //fill nodes with node objects
                nodes.push(new Node(i*25,j*25,Math.floor(Math.random() * 16777215)));

        }
    }

    loop(); //just render graphics on load instantly
    var myVar = setInterval(loop, 200); //cause game loop to iterate every 500ms
}

function update(progress) {
    yvel+=2;
}

function draw() {
    graphics.clear();

    for(var i = 0; i < nodes.length; i++) {   //draw every node each game loop
        nodes[i].color = Math.floor(Math.random() * 16777215);
        nodes[i].display();
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
function Node(x,y,color) {
    this.x = x;
    this.y = y;
    this.color = color;

    this.display = function() {
        graphics.beginFill(this.color); // Purple
        graphics.drawRect(this.x, this.y, 25, 25); // drawRect(x, y, width, height)
        graphics.endFill();
    }
}
