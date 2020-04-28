export function dijkstras(grid, startNode, finishNode) {
    const visitedNodes = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);

    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const currentNode = unvisitedNodes.shift();

        if (currentNode.isWall) continue;

        if (currentNode.distance === Infinity) return visitedNodes;

        currentNode.isVisited = true;
        visitedNodes.push(currentNode);

        if (currentNode === finishNode) return visitedNodes;
        updateUnvisitedNeighbors(grid, currentNode);
    }
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((A, B) => A.distance - B.distance);
}

function updateUnvisitedNeighbors(grid, currentNode) {
    const unvisitedNeighbors = getUnvisitedNeighbors(grid, currentNode);
    for (const node of unvisitedNeighbors) {
        node.distance = currentNode.distance + 1;
        node.previousNode = currentNode;
    }
}

function getUnvisitedNeighbors(grid, currentNode) {
    const unvisitedNeighbors = [];
    const {row, column} = currentNode;

    if (row > 0) unvisitedNeighbors.push(grid[row - 1][column]);
    if (row < grid.length - 1) unvisitedNeighbors.push(grid[row + 1][column]);
    if (column > 0) unvisitedNeighbors.push(grid[row][column - 1]);
    if (column < grid[0].length - 1) unvisitedNeighbors.push(grid[row][column + 1]);

    return unvisitedNeighbors.filter(node => !node.isVisited);
}

export function getShortestPath(finishNode) {
    const shortestPath = [];
    let currentNode = finishNode;
    
    while (currentNode !== null) {
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    return shortestPath;
}