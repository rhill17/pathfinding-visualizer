import React, {Component} from 'react';

import './Node.css';

// basic class for the Nodes that make up the grid
export default class Node extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        // knows its row and column, booleans for start/finish/wall nodes, and mouse handler
        const {row, 
            column, 
            isStart, 
            isFinish, 
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp} = this.props;

        // specific name, adding the description to the end
        const specificName = isStart ? 'node_start' : 
            isFinish ? 'node_finish' :
            isWall ? 'node_wall' :
            '';

        return (
            <div 
                id={`node-${row}-${column}`}
                className={`node ${specificName}`}
                onMouseDown={() => onMouseDown(row, column)}
                onMouseEnter={() => onMouseEnter(row, column)}
                onMouseUp={() => onMouseUp()}>
            </div>
        );
    }
}