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

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
            holdingStart: false,
            holdingFinish: false,
        };
    }

    componentDidMount() {
        const grid = constructGrid();
        this.setState({grid});
    }
    

    // when mouse is pressed, toggle the current node the mouse is over and update grid
    handleMouseDown(row, column) {
        const {grid} = this.state;

        if (grid[row][column].isStart) {
            this.setState({holdingStart: true});
        }
        else if (grid[row][column].isFinish) {
            this.setState({holdingFinish: true});
        }
        else {
            const updatedGrid = updateGridWithWallToggled(grid, row, column);
            this.setState({grid: updatedGrid});
        }

        this.setState({mouseIsPressed: true});
    }

    // when mouse is held
    handleMouseEnter(row, column) {
        const {grid, holdingStart, holdingFinish} = this.state;
        var updatedGrid;

        if (!this.state.mouseIsPressed) return;
        else if (holdingStart) {
            updatedGrid = updateGridMoveStartOrFinish(grid, row, column, true);
        }
        else if (holdingFinish) {
            updatedGrid = updateGridMoveStartOrFinish(grid, row, column, false);
        }
        else {
            updatedGrid = updateGridWithWallToggled(grid, row, column);
        }

        this.setState({grid: updatedGrid});
    }

    // mouse is released
    handleMouseUp() {
        this.setState({mouseIsPressed: false, holdingStart: false, holdingFinish: false});
    }


    // reset grid to original
    resetGrid() {
        // TODO - currently can reset mid run and clears what was on screen then continues to finish
        const {grid} = this.state;
        for (const row of grid) {
            for (const node of row) {
                node.distance = Infinity;
                node.previousNode = null;
                node.isVisited = false;
                node.isWall = false;
                node.isStart = false;
                node.isFinish = false;

                const currentNode = document.getElementById(`node-${node.row}-${node.column}`);

                if (node.row === START_NODE_ROW && node.column === START_NODE_COLUMN) {
                    node.isStart = true;
                    currentNode.className='node node_start';
                }
                else if (node.row === FINISH_NODE_ROW && node.column === FINISH_NODE_COLUMN) {
                    node.isFinish = true;
                    currentNode.className='node node_finish';
                }
                else currentNode.className='node';
            }
        }
    }

    // this method will not change the walls back to plain nodes
    // this method will be called before every algorithm is run to make sure
    // there are no visited nodes remaining from the last run
    preRunClearGrid() {
        const {grid} = this.state
        for (const row of grid) {
            for (const node of row) {
                node.distance = Infinity;
                node.previousNode = null;
                node.isVisited = false;
                const currentNode = document.getElementById(`node-${node.row}-${node.column}`);
                if (node.isStart) currentNode.className='node node_start';
                else if (node.isFinish) currentNode.className='node node_finish';
                else if (node.isWall) currentNode.className='node node_wall';
                else currentNode.className='node';
            }
        }
    }


    visualizeDijkstras(visitedNodes, shortestPath) {
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

    visualizeShortestPath(shortestPath) {
        for (let i = 0; i < shortestPath.length; i++) {
            setTimeout(() => {
              const node = shortestPath[i];
              document.getElementById(`node-${node.row}-${node.column}`).className ='node node_shortest_path';
            }, 50 * i);
          }
    }


    runDijkstras() {
        this.preRunClearGrid();
        const {grid} = this.state;
        const startNode = getStartNode(grid);
        const finishNode = getFinishNode(grid);
        const visitedNodes = dijkstras(grid, startNode, finishNode);
        const shortestPath = getShortestPath(finishNode);
        this.visualizeDijkstras(visitedNodes, shortestPath);
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
                        <div className="options">
                            <button onClick={() => this.runDijkstras()}>
                                Visualize Algorithm!
                            </button>
                            <button onClick={() => this.resetGrid()}>
                                Reset Grid
                            </button>
                        </div>
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

// isStart true means we are moving the start node, false means we are moving the finish node
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

const getStartNode = (grid) => {
    for (const row of grid) {
        for (const node of row) {
            if (node.isStart) return node;
        }
    }
}

const getFinishNode = (grid) => {
    for (const row of grid) {
        for (const node of row) {
            if (node.isFinish) return node;
        }
    }
}