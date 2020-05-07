import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        const {row, 
            column, 
            isStart, 
            isFinish, 
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp} = this.props;

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