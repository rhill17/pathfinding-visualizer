import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
    constructor (parameters) {
        super(parameters);
        this.state = {};
    }

    render() {
        return (
            <div className="node"></div>
        );
    }
}