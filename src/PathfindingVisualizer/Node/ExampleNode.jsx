import React, {Component} from 'react';

import './ExampleNode.css';

export default class ExampleNode extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        const {isExampleStart, 
            isExampleEnd, 
            isExampleWall,
            isExampleVisited,
            isExamplePath} = this.props;

        const specificName = isExampleStart ? 'start' :
            isExampleEnd ? 'finish' :
            isExampleWall ? 'wall' :
            isExampleVisited ? 'visited' :
            isExamplePath ? 'path' :
            '';

        return (
            <div 
                className={`example_node ${specificName}`}>
            </div>
        );
    }
}