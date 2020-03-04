var stage = new PIXI.Container();
var graphics = new PIXI.Graphics();
var renderer = PIXI.autoDetectRenderer(200, 200, { backgroundColor: 0x000000 });
renderer.resize(window.innerWidth, window.innerHeight - 4);
document.body.appendChild(renderer.view);
stage.addChild(graphics);

class Queue {

    constructor() {
        this.items = [];
    }

    enqueue(element) {
        // adding element to the queue 
        this.items.push(element);
    }
    dequeue() {
        // removing element from the queue 
        // returns underflow when called  
        // on empty queue 
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }
    front() {
        // returns the Front element of  
        // the queue without removing it. 
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }
    isEmpty() {
        // return true if the queue is empty. 
        return this.items.length == 0;
    }
    printQueue() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i] + " ";
        return str;
    }
}

var yvel;
var nodes;
var screenWidth;
var screenHeight;
var boardW;
var boardH;
var nodeSize;
var startNode;
var endNode;
var finished;

var queue;
var s;

init();
function init() {
    yvel = 0;
    nodes = [];
    boardW = 39;
    boardH = 20;
    finished = false;
    for (var i = 0; i < boardW; i++) {
        nodes[i] = [];
    }
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight - 4;
    nodeSize = screenHeight / boardH;
    for (var i = 0; i < boardW; i++) {   //fill nodes with node objects
        for (var j = 0; j < boardH; j++) {   //fill nodes with node objects
            nodes[i][j] = (new Node(i, j, 0xFFFFFF));

        }
    }
    startNode = nodes[15][15];
    startNode.color = 0xFFFF00;
    endNode = nodes[2][2];
    endNode.color = 0xFF0000;

    queue = new Queue();
    startNode.visited = true;
    queue.enqueue(startNode);

    loop(); //just render graphics on load instantly
    var myVar = setInterval(loop, 16); //cause game loop 60fps -> 16ms
}

function update(progress) {
    if (!finished) {
        breadthFirst();
    }
}

function draw() {
    graphics.clear();

    for (var i = 0; i < nodes.length; i++) {   //draw every node each game loop
        for (var j = 0; j < nodes[1].length; j++) {
            nodes[i][j].display();
        }
    }

}

function loop(progress) {
    update(progress);
    draw();
    renderer.render(stage);
}


function breadthFirst() {
    if (!queue.isEmpty()) {
        s = queue.dequeue();
        console.log(s);
        if (s === endNode) {
            console.log("finished!!");
            finished = true;
        } else {
            if (s.x > 0 && !nodes[s.x - 1][s.y].visited && !nodes[s.x - 1][s.y].isBoundaryNode) {
                nodes[s.x - 1][s.y].visited = true;
                nodes[s.x - 1][s.y].color = 0x00FF00;
                queue.enqueue(nodes[s.x - 1][s.y]);
            }
            if (s.y > 0 && !nodes[s.x][s.y - 1].visited && !nodes[s.x][s.y - 1].isBoundaryNode) {
                nodes[s.x][s.y - 1].visited = true;
                nodes[s.x][s.y - 1].color = 0x00FF00;
                queue.enqueue(nodes[s.x][s.y - 1]);
            }
            if (s.x < boardW - 1 && !nodes[s.x + 1][s.y].visited && !nodes[s.x + 1][s.y].isBoundaryNode) {
                nodes[s.x + 1][s.y].color = 0x00FF00;
                nodes[s.x + 1][s.y].visited = true;
                queue.enqueue(nodes[s.x + 1][s.y]);
            }
            if (s.y < boardH - 1 && !nodes[s.x][s.y + 1].visited && !nodes[s.x][s.y + 1].isBoundaryNode) {
                nodes[s.x][s.y + 1].visited = true;
                nodes[s.x][s.y + 1].color = 0x00FF00;
                queue.enqueue(nodes[s.x][s.y + 1]);
            }
        }
    }

}

function mousedown(event) {
    nodes[Math.floor(event.x / nodeSize)][Math.floor(event.y / nodeSize)].color = 0x555555;
    nodes[Math.floor(event.x / nodeSize)][Math.floor(event.y / nodeSize)].isBoundaryNode = true;
    draw();
    renderer.render(stage);
}
document.addEventListener('mousedown', mousedown);

//The object Node will make up the board
function Node(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.isStartNode = false;
    this.isEndNode = false;
    this.isBoundaryNode = false;
    this.visited = false;

    this.display = function () {
        if (this.isStartNode) {
            this.color = 0xFFFF00;
        }
        graphics.beginFill(this.color); // Purple
        graphics.lineStyle(5, 0x000000);
        graphics.drawRect(this.x * nodeSize, this.y * nodeSize, nodeSize, nodeSize); // drawRect(x, y, width, height)
        graphics.endFill();
    }
}