import React, {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
    constructor(parameters) {
        super(parameters);
        this.state = {};
    }

    render() {
        return (
            <div>
                Foo
                <Node></Node>
            </div>
        );
    }
}
