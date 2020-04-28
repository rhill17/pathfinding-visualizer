import React, {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
        };
    }


    componentDidMount() {
        const grid = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let column = 0; column < 60; column++) {
                const currentNode =  {
                    row,
                    column,
                    isStart: row === 10 && column === 10,
                    isFinish: row === 10 && column === 50
                };
                currentRow.push(currentNode);
            }
            grid.push(currentRow);
        }
        this.setState({grid});
    }


    render() {
        const {grid} = this.state;
        console.log(grid);

        return (
            <>
                <div className="header">
                    <div className="inner_header">
                        <div className="title">
                            <h1> Pathfinding Visualizer</h1>
                        </div>
                        <div className="options">
                            <button> Run </button>
                        </div>
                    </div>
                </div>
                <div className="grid">
                    {grid.map((row, rowIndex) => {
                        return <div key={rowIndex}>
                            {row.map((node, nodeIndex) => {
                                const {isStart, isFinish} = node;
                                return (
                                    <Node
                                        key={nodeIndex}
                                        isStart={isStart}
                                        isFinish={isFinish}></Node>
                                );
                            })}
                        </div>
                    })}
                </div>
            </>
        );
    }
}
