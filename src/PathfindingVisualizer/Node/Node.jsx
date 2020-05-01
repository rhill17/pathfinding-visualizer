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
            isExampleStart, 
            isExampleEnd, 
            isExampleWall,
            isExampleVisited,
            isExamplePath} = this.props;

        const specificName = isStart ? 'node_start' : 
            isFinish ? 'node_finish' :
            isWall ? 'node_wall' :
            isExampleStart ? 'example_start' :
            isExampleEnd ? 'example_end' :
            isExampleWall ? 'example_wall' :
            isExampleVisited ? 'example_visited' :
            isExamplePath ? 'example_path' :
            '';

        return (
            <div 
                id={`node-${row}-${column}`}
                className={`node ${specificName}`}>
            </div>
        );
    }
}