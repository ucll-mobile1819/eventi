import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { NavigationEvents } from 'react-navigation';

export default class AuthenticatedComponent extends Component {
    constructor(props) {
        super(props);
        this.checkingAuth = false;
    }

    async componentDidMount() {
        this.checkingAuth = true;
        await this.checkAuth();
    }

    async onNavFocus() {
        if (this.props.onLoad instanceof Function) this.props.onLoad();
        if (this.checkingAuth) return;
        this.checkAuth();
    }

    async checkAuth() {
        if (!await isAuthenticated()) {
            this.checkingAuth = false;
            this.props.navigate('Login');
        }
        this.checkingAuth = false;
    }

    render() {
        return (
            <>
                <NavigationEvents onDidFocus={() => this.onNavFocus()} />
                { this.props.children }
            </>
        );
    }
}