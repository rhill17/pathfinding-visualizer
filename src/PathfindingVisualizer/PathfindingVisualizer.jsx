import React, {Component} from 'react';
import Node from './Node/Node';
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
        };
    }

    componentDidMount() {
        const grid = constructGrid();
        this.setState({grid});
    }

    // mouse handler


    // reset grid button
    resetGrid() {
        // TODO - currently can reset mid run and clears what was on screen then continues to finish
        const {grid} = this.state
        for (const row of grid) {
            for (const node of row) {
                if (node.isStart) document.getElementById(`node-${node.row}-${node.column}`).className='node node_start';
                else if (node.isFinish) document.getElementById(`node-${node.row}-${node.column}`).className='node node_finish';
                else document.getElementById(`node-${node.row}-${node.column}`).className='node';
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
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COLUMN];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COLUMN];
        const visitedNodes = dijkstras(grid, startNode, finishNode);
        const shortestPath = getShortestPath(finishNode);
        this.visualizeDijkstras(visitedNodes, shortestPath);
    }



    render() {
        const {grid} = this.state;

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
                        <Node isExampleStart={true}></Node>
                        <em> End Node: </em>
                        <Node isExampleEnd={true}></Node>
                        <em> Wall: </em>
                        <Node isExampleWall={true}></Node>
                        <em> Visited Node: </em>
                        <Node isExampleVisited={true}></Node>
                        <em> Shortest Path: </em>
                        <Node isExamplePath={true}></Node>
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
                                        isWall={isWall}></Node>
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
        isExampleStart: false,
        isExampleEnd: false,
        isExampleWall: false,
    };
    return node;
}

const gridWithWallToggled = (grid, row, column) => {
    const updatedGrid = grid.slice();
    const node = updatedGrid[row][column];
    const updatedNode = {
        ...node,
        isWall: !node.isWall,
    };
    updatedGrid[row][column] = updatedNode;
    return updatedGrid;
}