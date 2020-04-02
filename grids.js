var blocks = []
function setMaze() {
	clearBoard(true);
	blocks = [];
	for (var i = 0; i < boardW; i++) {
		blocks[i] = [];
	}
	for (var i = 0; i < blocks.length; i++) {   //fill nodes with node objects
		for (var j = 0; j < boardH; j++) {   //fill nodes with node objects
			blocks[i][j] = (new Node(i, j, 0xFFFFFF));

		}
	}
	setMazeHelper(0, 0, boardW, boardH)

	nodes = blocks;
	startNodeX = 0;
	startNodeY = 0;
	endNodeX = boardW - 1;
	endNodeY = boardH - 1;
	startNode = nodes[startNodeX][startNodeY];
	startNode.color = 0xFFFF00;
	startNode.weight = 0;
	endNode = nodes[endNodeX][endNodeY];
	endNode.color = 0xFF0000;
}

function setMazeHelper(x1, y1, x2, y2) {
	console.log(blocks)
	if (x2 - x1 > 2 && y2 - y1 > 2) {
		let xint = Math.floor((x2 - x1) / 2) + x1;
		let yint = Math.floor((y2 - y1) / 2) + y1;
		let xhole = [Math.floor(Math.random() * (yint - y1)), Math.floor(Math.random() * (y2 - yint)) + yint]
		let yhole = [Math.floor(Math.random() * (xint - x1)), Math.floor(Math.random() * (x2 - xint)) + xint]
		for (var i = x1; i < x2; i++) {
			if (!yhole.includes(i)) {
				blocks[i][yint].color = 0x555555
				blocks[i][yint].isBoundaryNode = true;
			}
		}
		for (var i = y1; i < y2; i++) {
			if (!xhole.includes(i)) {
				blocks[xint][i].color = 0x555555
				blocks[xint][i].isBoundaryNode = true;
			}
		}
		//nodes = blocks;
		setMazeHelper(x1, y1, xint, yint)
		setMazeHelper(xint, y1 + 1, x2, yint)
		setMazeHelper(x1, yint + 1, xint, y2)
		setMazeHelper(xint + 1, yint + 1, x2, y2)
	}
}

var setSnail = function () {
	clearBoard(true);
	var snail = [];
	for (var i = 0; i < boardW; i++) {
		snail[i] = [];
	}
	for (var i = 0; i < snail.length; i++) {   //fill nodes with node objects
		for (var j = 0; j < boardH; j++) {   //fill nodes with node objects
			snail[i][j] = (new Node(i, j, 0xFFFFFF));

		}
	}

	var coords = [[2, 18], [2, 19], [3, 8], [3, 9], [3, 10], [3, 11], [3, 12], [3, 18], [4, 8], [4, 12], [4, 13], [4, 14], [4, 15], [4, 16], [4, 17], [4, 18], [5, 8], [6, 8], [6, 12], [6, 13], [6, 14], [6, 15], [6, 16], [7, 8], [7, 9], [7, 10], [7, 11], [7, 12], [7, 16], [7, 18], [8, 8], [8, 12], [8, 13], [8, 14], [8, 15], [8, 16], [9, 8], [9, 10], [9, 16], [10, 8], [10, 12], [10, 13], [10, 14], [10, 15], [10, 16], [11, 8], [11, 9], [11, 10], [11, 11], [11, 12], [11, 15], [12, 14], [13, 14], [14, 14], [14, 15], [15, 14], [15, 15], [15, 16], [15, 17], [16, 13], [16, 14], [17, 6], [17, 7], [17, 8], [17, 9], [17, 10], [17, 11], [17, 12], [18, 4], [18, 5], [19, 2], [19, 3], [19, 16], [20, 2], [20, 16], [21, 1], [21, 7], [21, 8], [21, 9], [21, 10], [21, 11], [21, 12], [21, 16], [22, 0], [22, 1], [22, 5], [22, 6], [22, 13], [22, 14], [22, 15], [22, 16], [23, 0], [23, 4], [23, 15], [23, 16], [23, 17], [24, 3], [24, 4], [24, 16], [24, 17], [25, 3], [25, 7], [25, 8], [25, 9], [25, 10], [25, 11], [25, 12], [25, 13], [25, 17], [26, 3], [26, 6], [26, 7], [26, 13], [26, 18], [27, 3], [27, 6], [27, 14], [27, 15], [27, 18], [28, 3], [28, 6], [28, 10], [28, 11], [28, 15], [28, 18], [29, 3], [29, 6], [29, 9], [29, 12], [29, 15], [29, 18], [30, 3], [30, 6], [30, 9], [30, 12], [30, 15], [30, 18], [31, 4], [31, 7], [31, 10], [31, 12], [31, 15], [31, 18], [32, 0], [32, 4], [32, 7], [32, 12], [32, 15], [32, 18], [33, 0], [33, 4], [33, 8], [33, 9], [33, 10], [33, 11], [33, 15], [33, 18], [34, 0], [34, 5], [34, 14], [34, 15], [34, 18], [35, 1], [35, 5], [35, 12], [35, 13], [35, 18], [36, 1], [36, 6], [36, 7], [36, 8], [36, 9], [36, 10], [36, 11], [36, 12], [36, 18], [37, 2], [37, 18], [38, 3], [38, 17]];
	for (var i = 0; i < coords.length; i++) {
		snail[coords[i][0]][coords[i][1]].color = 0x555555;
		snail[coords[i][0]][coords[i][1]].isBoundaryNode = true;
	}
	nodes = snail;
	startNodeX = 5;
	startNodeY = 10;
	endNodeX = 30;
	endNodeY = 10;
	startNode = nodes[startNodeX][startNodeY];
	startNode.color = 0xFFFF00;
	startNode.weight = 0;
	endNode = nodes[endNodeX][endNodeY];
	endNode.color = 0xFF0000;
}

var getCordinateList = function () {
	var lst = "[";
	for (var i = 0; i < nodes.length; i++) {   //fill nodes with node objects
		for (var j = 0; j < nodes[1].length; j++) {   //fill nodes with node objects
			if (nodes[i][j].isBoundaryNode)
				lst += "[" + i + "," + j + "],"

		}
	}
	console.log(lst + "]");
}