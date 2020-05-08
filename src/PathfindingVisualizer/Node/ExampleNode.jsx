import React, {Component} from 'react';

import './ExampleNode.css';

// basic class for the example nodes inside of the key (table of contents)
export default class ExampleNode extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        // boolean flags to determine which example node this is
        const {isExampleStart, 
            isExampleEnd, 
            isExampleWall,
            isExampleVisited,
            isExamplePath} = this.props;

        // specific name, adding on description at end
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