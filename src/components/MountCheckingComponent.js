import React, { Component } from "react";

export default class MountCheckingComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.setMounted instanceof Function) this.props.setMounted(true);
    }

    componentWillUnmount() {
        if (this.props.setMounted instanceof Function) this.props.setMounted(false);
    }

    render() {
        return (
            <>
                { this.props.children }
            </>
        );
    }
}