import React, {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
    constructor(parameters) {
        super(parameters);
        this.state = {
            grid: [],
        };
    }


    componentDidMount() {
        const grid = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let column = 0; column < 60; column++) {
                currentRow.push([]);
            }
            grid.push(currentRow);
        }
        this.setState({grid});
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
                            <button> Run </button>
                        </div>
                    </div>
                </div>
                <div className="grid">
                    {grid.map((row, rowIndex) => {
                        return <div>
                            {row.map((node, nodeIndex) => <Node></Node>)}
                        </div>
                    })}
                </div>
            </>
        );
    }
}
