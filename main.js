
var stage = new PIXI.Container();
var graphics = new PIXI.Graphics();
var renderer = PIXI.autoDetectRenderer(200, 200, { backgroundColor: 0x000000 });
renderer.resize(window.innerWidth, window.innerHeight - document.getElementById('control').offsetHeight - 4);
document.body.appendChild(renderer.view);
stage.addChild(graphics);
document.addEventListener('contextmenu', event => event.preventDefault());

var yvel;
var nodes;
var screenWidth, screenHeight;
var boardW, boardH;
var nodeSize;
var startNode, endNode;
var dijSelect, astarSelect, bfSelect, depthFirstSelect;
var controlHeight;
var startNodeX, startNodeY, endNodeX, endNodeY;
var isLeftDown, isRightDown;
var startNodeSelected, endNodeSelected;

//Used for breadthFirst
var queue;
var s;

var stack;
//For displaying
var visitedQueue;

var depthFirstRun;

init();
function init() {
    nodes = [];
    controlHeight = document.getElementById('control').offsetHeight;
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight - controlHeight - 4;
    if (screenWidth > 1900)
        nodeSize = screenWidth / 40;
    else if (screenWidth > 1000)
        nodeSize = screenWidth / 30;
    else
        nodeSize = screenWidth / 14;
    boardW = Math.floor(screenWidth / nodeSize);
    boardH = Math.floor(screenHeight / nodeSize);
    dijSelect = astarSelect = bfSelect = depthFirstSelect = false;
    startNodeX = 3;
    startNodeY = 3;
    endNodeX = boardW - 3;
    endNodeY = boardH - 3;
    isLeftDown = isRightDown = false;
    startNodeSelected = endNodeSelected = false;

    for (var i = 0; i < boardW; i++) {
        nodes[i] = [];
    }
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
    else if (depthFirstSelect)
        depthFirst();
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

function heuristic(a, b) {

    //euclidean - find the direct distance
    var d = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    return d;
}

/*############################################ [Dijkstra's Section] ##################################################*/

function triggerDij() {
    clearBoard(false);
    prio = new PriorityQueue();
    startNode.visited = true;
    prio.enqueue(startNode, 0);
    dijSelect = true;
}

function dij() {
    if (!prio.isEmpty()) {
        s = prio.dequeue().element;
        if (s !== startNode && s !== endNode) {
            s.color = 0x00FF00;
        }

        if (s === endNode) {
            console.log("Dijsktras Finished");
            astarSelect = false;
            drawPath();

        } else {
            var neighbours = s.getNeighbors(false);
            for (var i = 0; i < neighbours.length; i++) {
                neighbours[i].visited = true;
                neighbours[i].weight = s.weight + 1;

                if (neighbours[i] !== endNode)
                    neighbours[i].color = 0xA1FF96;
                prio.enqueue(neighbours[i], s.weight + 1);
            }
        }

    }
}

/*############################################ [A* Section] ##################################################*/

function triggerAStar() {
    clearBoard(false);
    prio = new PriorityQueue();
    startNode.visited = true;
    prio.enqueue(startNode, 1);
    astarSelect = true;
}

function AStar() {
    if (!prio.isEmpty()) {
        s = prio.dequeue().element;
        if (s !== startNode && s !== endNode) {
            s.color = 0x00FF00;
        }

        if (s === endNode) {
            console.log("AStar Finished");
            astarSelect = false;
            drawPath();

        } else {
            var neighbours = s.getNeighbors(false);
            for (var i = 0; i < neighbours.length; i++) {
                neighbours[i].visited = true;
                neighbours[i].weight = s.weight + 1;

                if (neighbours[i] !== endNode)
                    neighbours[i].color = 0xA1FF96;
                prio.enqueue(neighbours[i], heuristic(neighbours[i], endNode));
            }
        }
    }
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
        if (s !== startNode && s !== endNode)
            s.color = 0x00FF00;
        if (s === endNode) {
            console.log("finished!!");
            bfSelect = false;
            drawPath();
        } else {
            var neigbors = s.getNeighbors(false);
            for (var i = 0; i < neigbors.length; i++) {
                neigbors[i].visited = true;
                neigbors[i].weight = s.weight + 1;
                if (neigbors[i] !== endNode)
                    neigbors[i].color = 0xA1FF96;
                queue.enqueue(neigbors[i]);
            }
        }
    }
}
//Additional section -Patrick
/*############################################ [Depth First Section] ########################################### */
function triggerDepthFirst() {
    clearBoard(false);
    stack = new Stack();
    startNode.visited = true;
    stack.push(startNode);
    depthFirstSelect = true;
}

function depthFirst() {
    if (!stack.isEmpty()) {
        s = stack.pop();
        if (s !== startNode && s !== endNode) {
            s.color = 0x00FF00;
        }
        if (s === endNode) {
            console.log("DFS FINISHED");
            depthFirstSelect = false;
            drawPath();
            return;
        }
        else {
            var neighbors = s.getNeighbors(false);
            if (neighbors.length == 0) {
                console.log("no neighbors");
                return;
            } else {
                for (var i = 0; i < neighbors.length; i++) {
                    if (neighbors[i].visited == true) {
                        continue;
                    }
                    if (neighbors[i] !== endNode)
                        neighbors[i].color = 0xA1FF96;
                    neighbors[i].visited = true
                    neighbors[i].weight = s.weight + 1;
                    stack.push(neighbors[i]);
                }
            }
        }
    }
}

/*########################################### [Supporting Functions] ###############################################*/
//traces the least cost past by following the least weighted nodes of its neighbors
function drawPath() {
    var currentNode = endNode;
    var closest = currentNode;
    while (currentNode !== startNode) {
        neigbors = currentNode.getNeighbors(true)
        for (var i = 0; i < neigbors.length; i++)
            if (neigbors[i].weight < closest.weight)
                closest = neigbors[i]
        currentNode.color = 0x0000FF;
        currentNode = closest;
    }
}



//a full clear true will clear all boundary nodes, and a false full clear will only clear visited nodes
function clearBoard(fullClear) {
    for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < nodes[1].length; j++) {
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
    dijSelect = astarSelect = bfSelect = depthFirstSelect = false;
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
        graphics.lineStyle(3, 0x000000);
        graphics.drawRect(this.x * nodeSize, (this.y) * nodeSize, nodeSize, nodeSize); // drawRect(x, y, width, height)
        graphics.endFill();
    }

    //returns a list of all adjacent nodes, includeVisted set to false doesnt return visited nodes
    this.getNeighbors = function (includeVisited) {
        var list = [];
        if (this.x > 0 && (!nodes[this.x - 1][this.y].visited || includeVisited) && !nodes[this.x - 1][this.y].isBoundaryNode) {
            list = [...list, nodes[this.x - 1][this.y]];
        }
        if (this.y > 0 && (!nodes[this.x][this.y - 1].visited || includeVisited) && !nodes[this.x][this.y - 1].isBoundaryNode) {
            list = [...list, nodes[this.x][this.y - 1]];
        }
        if (this.x < boardW - 1 && (!nodes[this.x + 1][this.y].visited || includeVisited) && !nodes[this.x + 1][this.y].isBoundaryNode) {
            list = [...list, nodes[this.x + 1][this.y]];
        }
        if (this.y < boardH - 1 && (!nodes[this.x][this.y + 1].visited || includeVisited) && !nodes[this.x][this.y + 1].isBoundaryNode) {
            list = [...list, nodes[this.x][this.y + 1]];
        }
        return list;
    }
}

//check if any algorithms from running so board does not break when moving start and end nodes
function isRunning() {
    return (dijSelect || astarSelect || bfSelect || depthFirstSelect);
}

/*########################### [ Supporting Data Structures ] ##################################*/

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
    isEmpty() {
        return this.items.length == 0;
    }
}

class Stack {
    constructor() {
        this.items = [];
    }
    push(element) {
        this.items.push(element);
    }
    pop() {
        var poppedElement;
        if (this.isEmpty()) {
            console.log("Underflow");

            return "Underflow";
        }
        poppedElement = this.items.pop();
        return poppedElement;
    }
    isEmpty() {
        return this.items.length == 0;
    }
}

// User defined class 
// to store element and its priority 
class QElement {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}

// PriorityQueue class 
class PriorityQueue {

    // An array is used to implement priority 
    constructor() {
        this.items = [];
    }
    // enqueue function to add element 
    // to the queue as per priority 
    enqueue(element, priority) {
        // creating object from queue element 
        var qElement = new QElement(element, priority);
        var contain = false;

        // iterating through the entire 
        // item array to add element at the 
        // correct location of the Queue 
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                // Once the correct location is found it is 
                // enqueued 
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }

        // if the element have the highest priority 
        // it is added at the end of the queue 
        if (!contain) {
            this.items.push(qElement);
        }
    }

    // dequeue method to remove 
    // element from the queue 
    dequeue() {
        // return the dequeued element 
        // and remove it. 
        // if the queue is empty 
        // returns Underflow 
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    // isEmpty function 
    isEmpty() {
        // return true if the queue is empty. 
        return this.items.length == 0;
    }


    // functions to be implemented 
    // enqueue(item, priority) 
    // dequeue() 
    // front() 
    // isEmpty() 
    // printPQueue() 

}

/*################################# [ Controls ] ####################################### */
window.addEventListener('mousedown', function (e) {
    if (e.y > controlHeight) {
        hoveredNode = nodes[Math.floor(e.x / nodeSize)][Math.floor((e.y - controlHeight) / nodeSize)];
        if (e.button == 0) {
            isLeftDown = true;
        } else if (e.button == 2) {
            isRightDown = true;
        }
        //selecting boundary nodes
        if ((isLeftDown || isRightDown) && hoveredNode !== endNode && hoveredNode !== startNode) {
            if (!hoveredNode.isBoundaryNode && isLeftDown) {
                hoveredNode.color = 0x555555;
                hoveredNode.isBoundaryNode = true;
            } else if (isRightDown) {
                hoveredNode.color = 0xFFFFFF;
                hoveredNode.isBoundaryNode = false;
            }
            //allows mouse move to change the location of start and end node
        } else if (isLeftDown && hoveredNode === startNode && !isRunning()) {
            startNodeSelected = true;
            clearBoard(false);
        } else if (isLeftDown && hoveredNode === endNode && !isRunning()) {
            endNodeSelected = true;
            clearBoard(false);
        }
    }
});

//moves start and end node location by dragging them
window.addEventListener('mousemove', function (e) {
    //draws boundaries or clears them if mouse drags over a node
    if ((isLeftDown || isRightDown)) {
        hoveredNode = nodes[Math.floor(e.x / nodeSize)][Math.floor((e.y - controlHeight) / nodeSize)];
        if (hoveredNode !== endNode && hoveredNode !== startNode && !startNodeSelected && !endNodeSelected) {
            if (!hoveredNode.isBoundaryNode && isLeftDown) {
                hoveredNode.color = 0x555555;
                hoveredNode.isBoundaryNode = true;
            } else if (isRightDown) {
                hoveredNode.color = 0xFFFFFF;
                hoveredNode.isBoundaryNode = false;
            }

            //moves start and end node location by dragging them
        } else if (startNodeSelected && !hoveredNode.isBoundaryNode && hoveredNode !== endNode) {
            startNode.color = 0xFFFFFF;
            startNode = hoveredNode;
            startNodeX = Math.floor(e.x / nodeSize);
            startNodeY = Math.floor((e.y - controlHeight) / nodeSize);
            startNode = nodes[startNodeX][startNodeY];
            startNode.color = 0xFFFF00;
            startNode.weight = 0;
        } else if (endNodeSelected && !hoveredNode.isBoundaryNode && hoveredNode !== startNode) {
            endNode.color = 0xFFFFFF;
            endNode = hoveredNode;
            endNodeX = Math.floor(e.x / nodeSize);
            endNodeY = Math.floor((e.y - controlHeight) / nodeSize);
            endNode = nodes[endNodeX][endNodeY];
            endNode.color = 0xFF0000;
        }
    }
});

window.addEventListener('mouseup', function (e) {
    isLeftDown = isRightDown = false;
    if (startNodeSelected)
        startNodeSelected = false;
    if (endNodeSelected)
        endNodeSelected = false;
});

//Mobile controls
window.addEventListener('touchstart', function (e) {
    if (e.changedTouches[0].pageY > controlHeight) {
        hoveredNode = nodes[Math.floor(e.changedTouches[0].pageX / nodeSize)][Math.floor((e.changedTouches[0].pageY - controlHeight) / nodeSize)];
        if (hoveredNode !== endNode && hoveredNode !== startNode) {
            if (!hoveredNode.isBoundaryNode) {
                hoveredNode.color = 0x555555;
                hoveredNode.isBoundaryNode = true;
            } else {
                hoveredNode.color = 0xFFFFFF;
                hoveredNode.isBoundaryNode = false;
            }
        } else if (hoveredNode === startNode && !isRunning()) {
            startNodeSelected = true;
            clearBoard(false);
        } else if (hoveredNode === endNode && !isRunning()) {
            endNodeSelected = true;
            clearBoard(false);
        }
    }
});

window.addEventListener('touchmove', function (e) {
    hoveredNode = nodes[Math.floor(e.touches[0].clientX / nodeSize)][Math.floor((e.touches[0].clientY - controlHeight) / nodeSize)];
    if (hoveredNode !== endNode && hoveredNode !== startNode && !startNodeSelected && !endNodeSelected) {
        if (!hoveredNode.isBoundaryNode) {
            hoveredNode.color = 0x555555;
            hoveredNode.isBoundaryNode = true;
        }

    } else if (startNodeSelected && !hoveredNode.isBoundaryNode && hoveredNode !== endNode) {
        startNode.color = 0xFFFFFF;
        startNode = hoveredNode;
        startNodeX = Math.floor(e.touches[0].clientX / nodeSize);
        startNodeY = Math.floor((e.touches[0].clientY - controlHeight) / nodeSize);
        startNode = nodes[startNodeX][startNodeY];
        startNode.color = 0xFFFF00;
        startNode.weight = 0;
    } else if (endNodeSelected && !hoveredNode.isBoundaryNode && hoveredNode !== startNode) {
        endNode.color = 0xFFFFFF;
        endNode = hoveredNode;
        endNodeX = Math.floor(e.touches[0].clientX / nodeSize);
        endNodeY = Math.floor((e.touches[0].clientY - controlHeight) / nodeSize);
        endNode = nodes[endNodeX][endNodeY];
        endNode.color = 0xFF0000;
    }
});

window.addEventListener('touchend', function (e) {
    if (startNodeSelected)
        startNodeSelected = false;
    if (endNodeSelected)
        endNodeSelected = false;
});