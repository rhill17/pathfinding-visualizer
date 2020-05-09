import React, {Component} from 'react';
import Node from './Node/Node';
import ExampleNode from './Node/ExampleNode'
import {dijkstras, getShortestPath} from '../Algorithms/dijkstras';

import './PathfindingVisualizer.css';

// constants
const NUMBER_OF_ROWS = 19;
const NUMBER_OF_COLUMNS = 60;
const START_NODE_ROW = 9;
const START_NODE_COLUMN = 11;
const FINISH_NODE_ROW = 9;
const FINISH_NODE_COLUMN = 49;

// main class for project
export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
            holdingStart: false,
            holdingFinish: false,
            currentAlgorithm: "Dijkstra's",
            shortestPathDistance: 0,
            finishNode: createNode(0,0),
        };
    }

    // first construct the grid and set it to the state
    componentDidMount() {
        const grid = constructGrid();
        const startNode = grid[START_NODE_ROW][START_NODE_COLUMN];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COLUMN];
        this.setState({grid});
        document.querySelector('.alg').innerHTML = this.state.currentAlgorithm;
        document.querySelector('.dist').innerHTML = this.state.shortestPathDistance;  
    }

    
    

    // when mouse is pressed
    handleMouseDown(row, column) {
        const {grid} = this.state;

        // if the node clicked is the start node set holdingStart flag to true
        if (grid[row][column].isStart) {
            this.setState({holdingStart: true});
        }
        // else if node clicked is the finish node set holdingFinish flag to true
        else if (grid[row][column].isFinish) {
            this.setState({holdingFinish: true});
        }
        // else a normal node is being clicked and toggle that node's isWall (normal -> wall, wall -> normal)
        else {
            const updatedGrid = updateGridWithWallToggled(grid, row, column);
            this.setState({grid: updatedGrid});
        }

        // set mouseIsPressed flag to true
        this.setState({mouseIsPressed: true});
    }

    // when mouse is held
    handleMouseEnter(row, column) {
        const {grid, holdingStart, holdingFinish} = this.state;
        var updatedGrid;

        if (!this.state.mouseIsPressed) return;
        // holding start so call helper method with isStart parameter as true
        else if (holdingStart) {
            updatedGrid = updateGridMoveStartOrFinish(grid, row, column, true);
        }
        // holding finish so call helper method with isStart parameter as finish
        else if (holdingFinish) {
            updatedGrid = updateGridMoveStartOrFinish(grid, row, column, false);
        }
        // not holding either, means we are toggling walls
        else {
            updatedGrid = updateGridWithWallToggled(grid, row, column);
        }

        // set main grid to be the updated grid
        this.setState({grid: updatedGrid});
    }

    // mouse is released
    handleMouseUp() {
        // reset all flags to false
        this.setState({mouseIsPressed: false, holdingStart: false, holdingFinish: false});
    }


    // reset grid to original
    resetGrid() {
        // TODO - currently can reset mid run and clears what was on screen then continues to finish
        const {grid} = this.state;
        this.setState({shortestPathDistance: 0});

        // SOMETHING WEIRD, HAPPENS ON SECOND CLICK NOT FIRST
        document.querySelector('.dist').innerHTML = this.state.shortestPathDistance;

        // for each node in the grid
        for (const row of grid) {
            for (const node of row) {
                // reset all the necessary attritubes to their defaults
                node.distance = Infinity;
                node.previousNode = null;
                node.isVisited = false;
                node.isWall = false;
                node.isStart = false;
                node.isFinish = false;

                // get currentNode element
                const currentNode = document.getElementById(`node-${node.row}-${node.column}`);

                // if current node is located at the default starting node position, set it as the start node
                if (node.row === START_NODE_ROW && node.column === START_NODE_COLUMN) {
                    node.isStart = true;
                    currentNode.className='node node_start';
                }
                // else if current node is located at default finish node position, set it as the finish node
                else if (node.row === FINISH_NODE_ROW && node.column === FINISH_NODE_COLUMN) {
                    node.isFinish = true;
                    currentNode.className='node node_finish';
                }
                // else set the node to the default plain node
                else currentNode.className='node';
            }
        }
    }

    // this method will not change the walls back to plain nodes
    // this method will be called before every algorithm is run to make sure
    // there are no visited nodes remaining from the last run
    preRunClearGrid() {
        const {grid} = this.state

        // for each node in the grid
        for (const row of grid) {
            for (const node of row) {
                // reset the attributes that are needed to run dijkstras
                // but we will leave the walls, start, and finish node as is
                node.distance = Infinity;
                node.previousNode = null;
                node.isVisited = false;

                // get current node element
                const currentNode = document.getElementById(`node-${node.row}-${node.column}`);

                // if current node is the start node, display as so
                if (node.isStart) currentNode.className='node node_start';
                // else if the node is the finish node, display as so
                else if (node.isFinish) currentNode.className='node node_finish';
                // else if the node is a wall, display as so
                else if (node.isWall) currentNode.className='node node_wall';
                // else reset to a basic plain node
                else currentNode.className='node';
            }
        }
    }


    // method to visualize the dijkstras algorithm
    visualizeDijkstras(visitedNodes, shortestPath) {
        // for each node in visitedNodes array
        // reference by i so we can use the i as a way to space out the animations
        for (let i = 0; i <= visitedNodes.length; i++) {
            if (i === visitedNodes.length) {
              setTimeout(() => {
                this.visualizeShortestPath(shortestPath);
              }, 10 * i);
              return;
            }
            setTimeout(() => {
              const node = visitedNodes[i];
              document.getElementById(`node-${node.row}-${node.column}`).className='node node_visited';
            }, 10 * i);
        }
    }

    // method to visualize the shortest path of the algorithm
    visualizeShortestPath(shortestPath) {
        // for each node in visitedNodes array
        // reference by i so we can use the i as a way to space out the animations
        for (let i = 0; i < shortestPath.length; i++) {
            setTimeout(() => {
              const node = shortestPath[i];
              document.getElementById(`node-${node.row}-${node.column}`).className ='node node_shortest_path';
            }, 50 * i);
        }

        this.setState({shortestPathDistance: this.state.finishNode.distance});
        document.querySelector('.dist').innerHTML = this.state.shortestPathDistance;
    }


    // method to run the dijkstras method
    runDijkstras() {
        // call pre-run clear to make sure possible previous run is not affecting this run
        this.preRunClearGrid();
        const {grid} = this.state;
        const startNode = getStartNode(grid);
        const finishNode = getFinishNode(grid);
        const visitedNodes = dijkstras(grid, startNode, finishNode);
        const shortestPath = getShortestPath(finishNode);
        this.setState({finishNode});
        this.visualizeDijkstras(visitedNodes, shortestPath);
    }


    changeAlgorithm(selectedAlgorithm) {
        this.setState({currentAlgorithm: selectedAlgorithm});

        // SOMETHING WEIRD HAPPENING WITH THESE, HAPPENS ON THE SECOND CLICK NOT THE FIRST
        document.querySelector('.alg').innerHTML = this.state.currentAlgorithm;
    }



    render() {
        const {grid, mouseIsPressed} = this.state;
        return (
            <>
                <div className="header">
                    <div className="inner_header">
                        <div className="title">
                            <h1> Pathfinding Visualizer</h1>
                        </div>
                        <ul>
                            <li className='dropdown'>
                                <button className='dropbtn'> Algorithms &#9662; </button>
                                <div className='dropdown-content'>
                                    <button onClick={() => this.changeAlgorithm("Dijkstra's")}> Dijkstra's </button>
                                    <button onClick={() => this.changeAlgorithm("DFS")}> DFS </button>
                                    <button onClick={() => this.changeAlgorithm("BFS")}> BFS </button>
                                </div>
                            </li>
                            <li><button onClick={() => this.runDijkstras()}> Visualize Algorithm! </button></li>
                            <li><button onClick={() => this.resetGrid()}> Reset Grid </button></li>
                        </ul>
                    </div>
                </div>
                <div className="table_of_contents">
                    <div className="key">
                        <em> Start Node: </em>
                        <ExampleNode isExampleStart={true}></ExampleNode>
                        <em> End Node: </em>
                        <ExampleNode isExampleEnd={true}></ExampleNode>
                        <em> Wall: </em>
                        <ExampleNode isExampleWall={true}></ExampleNode>
                        <em> Visited Node: </em>
                        <ExampleNode isExampleVisited={true}></ExampleNode>
                        <em> Shortest Path: </em>
                        <ExampleNode isExamplePath={true}></ExampleNode>
                    </div>
                    <div className='selected_alg'>
                        <p> Selected Algorithm: <span className='alg'></span></p>
                    </div>
                    <div className='distance'>
                        <p> Distance: <span className='dist'></span></p>
                    </div>
                </div>
                <div className="grid">
                    {grid.map((row, rowIndex) => {
                        return <div key={rowIndex}>
                            {row.map((node, nodeIndex) => {
                                const {row, column, isStart, isFinish, isWall} = node;
                                return (
                                    <Node
                                        key={nodeIndex}
                                        row={row}
                                        column={column}
                                        isStart={isStart}
                                        isFinish={isFinish}
                                        isWall={isWall}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown={(row, column) => this.handleMouseDown(row, column)}
                                        onMouseEnter={(row, column) => this.handleMouseEnter(row, column)}
                                        onMouseUp={() => this.handleMouseUp()}></Node>
                                );
                            })}
                        </div>
                    })}
                </div>
            </>
        );   
    }
}

// helper method to construct the initial grid
const constructGrid = () => {
    const grid = [];
        for (let row = 0; row < NUMBER_OF_ROWS; row++) {
            const currentRow = [];
            for (let column = 0; column < NUMBER_OF_COLUMNS; column++) {
                currentRow.push(createNode(row, column));
            }
            grid.push(currentRow);
        }
    return grid;
}

// helper method to create a node with all the default values that will be needed
const createNode = (row, column) => {
    const node =  {
        row,
        column,
        isStart: row === START_NODE_ROW && column === START_NODE_COLUMN,
        isFinish: row === FINISH_NODE_ROW && column === FINISH_NODE_COLUMN,
        isVisited: false,
        isWall: false,
        distance: Infinity,
        previousNode: null,
    };
    return node;
}

// helper method to update the grid with a node wall toggled (normal -> wall, wall -> normal)
const updateGridWithWallToggled = (grid, row, column) => {
    const updatedGrid = grid.slice();
    const node = updatedGrid[row][column];
    const updatedNode = {
        ...node,
        isWall: !node.isWall,
    };
    updatedGrid[row][column] = updatedNode;
    return updatedGrid;
}

// helper method for moving the start or finish node around the grid
// movingStart true means we are moving the start node, false means we are moving the finish node
const updateGridMoveStartOrFinish = (grid, row, column, movingStart) => {
    const updatedGrid = grid.slice();
    // make old start/finish plain node
    if (movingStart) {
        const oldStartNode = getStartNode(updatedGrid);
        const removeOldStartNode = {
            ...oldStartNode,
            isStart: false,
        };
        updatedGrid[oldStartNode.row][oldStartNode.column] = removeOldStartNode;
    }
    else {
        const oldFinishNode = getFinishNode(updatedGrid);
        const removeOldFinishNode = {
            ...oldFinishNode,
            isFinish: false,
        };
        updatedGrid[oldFinishNode.row][oldFinishNode.column] = removeOldFinishNode;
    }

    // new start/finish
    const node = updatedGrid[row][column];
    var updatedNode;
    if (movingStart) {
        updatedNode = {
            ...node,
            isStart: !node.isStart,
        };
    }
    else {
        updatedNode = {
            ...node,
            isFinish: !node.isFinish,
        };
    }

    updatedGrid[row][column] = updatedNode;
    return updatedGrid;
}

// helper method to get the current start node on the grid
const getStartNode = (grid) => {
    for (const row of grid) {
        for (const node of row) {
            if (node.isStart) return node;
        }
    }
}

// helper method to get the current finish node on the grid
const getFinishNode = (grid) => {
    for (const row of grid) {
        for (const node of row) {
            if (node.isFinish) return node;
        }
    }
}