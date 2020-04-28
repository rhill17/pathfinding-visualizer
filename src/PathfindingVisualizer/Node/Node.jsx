import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        const {isStart, isFinish} = this.props;
        const specificName = isStart ? 'node_start' : isFinish ? 'node_finish' : '';

        return (
            <div className={`node ${specificName}`}></div>
        );
    }
}