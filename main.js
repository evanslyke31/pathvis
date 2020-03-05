var stage = new PIXI.Container();
var graphics = new PIXI.Graphics();
var renderer = PIXI.autoDetectRenderer(200, 200, { backgroundColor: 0x000000 });
renderer.resize(window.innerWidth, window.innerHeight - document.getElementById('control').offsetHeight - 4);
document.body.appendChild(renderer.view);
stage.addChild(graphics);
document.addEventListener('mousedown', mousedown);

class Queue {
    constructor() {
        this.items = [];
    }
    enqueue(element) {
        this.items.push(element);
    }
    dequeue() {
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }
    front() {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }
    isEmpty() {
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
var screenWidth, screenHeight;
var boardW, boardH;
var nodeSize;
var startNode, endNode;
var dijSelect, astarSelect, bfSelect, swarmSelect;
var controlHeight;
var startNodeX, startNodeY, endNodeX, endNodeY;

//Used for breadthFirst
var queue;
var s;

init();
function init() {
    yvel = 0;
    nodes = [];
    boardW = 39;
    boardH = 20;
    dijSelect = astarSelect = bfSelect = swarmSelect = false;
    controlHeight = document.getElementById('control').offsetHeight;
    startNodeX = 5;
    startNodeY = 10;
    endNodeX = 30;
    endNodeY = 10;

    for (var i = 0; i < boardW; i++) {
        nodes[i] = [];
    }
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight - controlHeight - 4;
    nodeSize = screenHeight / boardH;
    for (var i = 0; i < nodes.length; i++) {   //fill nodes with node objects
        for (var j = 0; j < boardH; j++) {   //fill nodes with node objects
            nodes[i][j] = (new Node(i, j, 0xFFFFFF));

        }
    }

    startNode = nodes[startNodeX][startNodeY];
    startNode.color = 0xFFFF00;
    startNode.weight = 0;
    endNode = nodes[endNodeX][endNodeY];
    endNode.color = 0xFF0000;

    loop(); //just render graphics on load instantly
    var myVar = setInterval(loop, 16); //cause game loop 60fps -> 16ms
}

function update(progress) {
    if (bfSelect)
        breadthFirst();
    else if (dijSelect)
        dij();
    else if (astarSelect)
        AStar();
    else if (swarmSelect)
        swarm();
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

/*############################################ [Dijkstra's Section] ##################################################*/

function triggerDij() {
    clearBoard(false);

    dijSelect = true;
}

function dij() {

}

/*############################################ [A* Section] ##################################################*/

function triggerAStar() {
    clearBoard(false);

    astarSelect = true;
}

function AStar() {

}

/*######################################## [Breadth-First Section] #############################################*/

function triggerBreadthFirst() {
    clearBoard(false);
    queue = new Queue();
    startNode.visited = true;
    queue.enqueue(startNode);
    bfSelect = true;
}

function breadthFirst() {
    if (!queue.isEmpty()) {
        s = queue.dequeue();
        //console.log(s);
        if (s !== startNode && s !== endNode)
            s.color = 0x00FF00;
        if (s === endNode) {
            console.log("finished!!");
            finished = true;
            bfSelect = false;
            drawPath();
        } else {
            if (s.x > 0 && !nodes[s.x - 1][s.y].visited && !nodes[s.x - 1][s.y].isBoundaryNode) {
                nodes[s.x - 1][s.y].visited = true;
                nodes[s.x - 1][s.y].weight = s.weight + 1;
                if (nodes[s.x - 1][s.y] !== endNode)
                    nodes[s.x - 1][s.y].color = 0xA1FF96;
                queue.enqueue(nodes[s.x - 1][s.y]);
            }
            if (s.y > 0 && !nodes[s.x][s.y - 1].visited && !nodes[s.x][s.y - 1].isBoundaryNode) {
                nodes[s.x][s.y - 1].visited = true;
                nodes[s.x][s.y - 1].weight = s.weight + 1;
                if (nodes[s.x][s.y - 1] !== endNode)
                    nodes[s.x][s.y - 1].color = 0xA1FF96;
                queue.enqueue(nodes[s.x][s.y - 1]);
            }
            if (s.x < boardW - 1 && !nodes[s.x + 1][s.y].visited && !nodes[s.x + 1][s.y].isBoundaryNode) {
                if (nodes[s.x + 1][s.y] !== endNode)
                    nodes[s.x + 1][s.y].color = 0xA1FF96;
                nodes[s.x + 1][s.y].visited = true;
                nodes[s.x + 1][s.y].weight = s.weight + 1;
                queue.enqueue(nodes[s.x + 1][s.y]);
            }
            if (s.y < boardH - 1 && !nodes[s.x][s.y + 1].visited && !nodes[s.x][s.y + 1].isBoundaryNode) {
                nodes[s.x][s.y + 1].visited = true;
                nodes[s.x][s.y + 1].weight = s.weight + 1;
                if (nodes[s.x][s.y + 1] !== endNode)
                    nodes[s.x][s.y + 1].color = 0xA1FF96;
                queue.enqueue(nodes[s.x][s.y + 1]);
            }
        }
    }

}

/*############################################ [Swarm Section] ##################################################*/

function triggerSwarm() {
    clearBoard(false);

    swarmSelect = true;
}

function swarm() {

}

function drawPath() {
    var currentNode = endNode;
    var closest = currentNode;
    while (currentNode !== startNode) {
        if (currentNode.y < boardH - 1 && nodes[currentNode.x][currentNode.y + 1].weight < closest.weight && !nodes[currentNode.x][currentNode.y + 1].isBoundaryNode) {
            closest = nodes[currentNode.x][currentNode.y + 1];
        }
        if (currentNode.x > 0 && nodes[currentNode.x - 1][currentNode.y].weight < closest.weight && !nodes[currentNode.x - 1][currentNode.y].isBoundaryNode) {
            closest = nodes[currentNode.x - 1][currentNode.y];
        }
        if (currentNode.y > 0 && nodes[currentNode.x][currentNode.y - 1].weight < closest.weight && !nodes[currentNode.x][currentNode.y - 1].isBoundaryNode) {
            closest = nodes[currentNode.x][currentNode.y - 1];
        }
        if (currentNode.x < boardW - 1 && nodes[currentNode.x + 1][currentNode.y].weight < closest.weight && !nodes[currentNode.x + 1][currentNode.y].isBoundaryNode) {
            closest = nodes[currentNode.x + 1][currentNode.y];
        }
        currentNode.color = 0x0000FF;
        currentNode = closest;
    }
}

function mousedown(event) {
    if (event.y > controlHeight) {
        if (!nodes[Math.floor(event.x / nodeSize)][Math.floor((event.y - controlHeight) / nodeSize)].isBoundaryNode) {
            nodes[Math.floor(event.x / nodeSize)][Math.floor((event.y - controlHeight) / nodeSize)].color = 0x555555;
            nodes[Math.floor(event.x / nodeSize)][Math.floor((event.y - controlHeight) / nodeSize)].isBoundaryNode = true;
        } else {
            nodes[Math.floor(event.x / nodeSize)][Math.floor((event.y - controlHeight) / nodeSize)].color = 0xFFFFFF;
            nodes[Math.floor(event.x / nodeSize)][Math.floor((event.y - controlHeight) / nodeSize)].isBoundaryNode = false;
        }
        draw();
        renderer.render(stage);
    }
}

function clearBoard(fullClear) {
    for (var i = 0; i < nodes.length; i++) {   //fill nodes with node objects
        for (var j = 0; j < nodes[1].length; j++) {   //fill nodes with node objects
            nodes[i][j].visited = false;
            nodes[i][j].weight = 9999;
            if (nodes[i][j] !== startNode && nodes[i][j] !== endNode) {
                if (fullClear && nodes[i][j].isBoundaryNode) {
                    nodes[i][j].isBoundaryNode = false;
                    nodes[i][j].color = 0xFFFFFF;
                } else if (!nodes[i][j].isBoundaryNode) {
                    nodes[i][j].color = 0xFFFFFF;
                }
            }

        }
    }
    startNode = nodes[startNodeX][startNodeY];
    startNode.color = 0xFFFF00;
    startNode.weight = 0;
    endNode = nodes[endNodeX][endNodeY];
    endNode.color = 0xFF0000;
    dijSelect = astarSelect = bfSelect = swarmSelect = false;
}

//The object Node will make up the board
function Node(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.isBoundaryNode = false;
    this.visited = false;
    this.weight = 99999;

    this.display = function () {
        graphics.beginFill(this.color);
        graphics.lineStyle(5, 0x000000);
        graphics.drawRect(this.x * nodeSize, (this.y) * nodeSize, nodeSize, nodeSize); // drawRect(x, y, width, height)
        graphics.endFill();
    }
}

