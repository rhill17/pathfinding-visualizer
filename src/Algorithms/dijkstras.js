// funciton to run dijkstras algorithm on the given grid, start node and finish node
export function dijkstras(grid, startNode, finishNode) {
    const visitedNodes = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);

    // loop until unvisitedNodes is empty (will exit and return visited nodes when finished)
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);

        // grab closest node by shifting off of front
        const currentNode = unvisitedNodes.shift();

        // if this node is a wall, we cannot use this as a possible path so skip it
        if (currentNode.isWall) continue;

        // if this node's distance from start is infinity, something went wrong and it is not possible
        // (like trapped in walls)
        if (currentNode.distance === Infinity) return visitedNodes;

        // this node is valid, mark it as visited and add it to the visitedNodes
        currentNode.isVisited = true;
        visitedNodes.push(currentNode);

        // check if this node is the finish node, if so we are done
        if (currentNode === finishNode) return visitedNodes;

        // if this is reached we are not done so update our unvisited array of nodes
        updateUnvisitedNeighbors(grid, currentNode);
    }
}

// helper function for dijkstras
// gets all the nodes into an array to start the algorithm
function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

// helper function for dijkstras
// takes the unvisitedNodes array and sorts it so the nodes with smallest distance are first
// (not designed to be super efficient at the moment)
function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((A, B) => A.distance - B.distance);
}

// helper function for dijkstras
// updates the distance and previous node for the neihboring nodes of the current node
function updateUnvisitedNeighbors(grid, currentNode) {
    const unvisitedNeighbors = getUnvisitedNeighbors(grid, currentNode);
    for (const node of unvisitedNeighbors) {
        node.distance = currentNode.distance + 1;
        node.previousNode = currentNode;
    }
}

// helper function for updating the unvisited neighbors
// returns all of the unvisited neighbors of the current node
function getUnvisitedNeighbors(grid, currentNode) {
    const unvisitedNeighbors = [];
    const {row, column} = currentNode;

    // grab four neighboring nodes (top, bottom, left, right)
    // check if the current node is not on one of the four edges
    if (row > 0) unvisitedNeighbors.push(grid[row - 1][column]);
    if (row < grid.length - 1) unvisitedNeighbors.push(grid[row + 1][column]);
    if (column > 0) unvisitedNeighbors.push(grid[row][column - 1]);
    if (column < grid[0].length - 1) unvisitedNeighbors.push(grid[row][column + 1]);

    // filter array for only nodes that are not visited yet
    return unvisitedNeighbors.filter(node => !node.isVisited);
}

// function to get the shortest path working backwards from the finish node
export function getShortestPath(finishNode) {
    const shortestPath = [];
    let currentNode = finishNode;
    
    // loop until the current node's previous node is null (meaning we are at the start node)
    while (currentNode !== null) {
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    return shortestPath;
}