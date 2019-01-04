import React, { Component } from "react";
import { DeviceEventEmitter, ActivityIndicator, View, StyleSheet } from 'react-native';
import { isAuthenticated } from "../auth";
import { NavigationEvents } from 'react-navigation';

export default class AuthenticatedComponent extends Component {
    constructor(props) {
        super(props);
        if (!this.props.showActivityIndicator) this.props.showActivityIndicator = () => false;
        this.checkingAuth = false;
        this.onLoadExecuted = false;
    }

    async componentDidMount() {
        this.onNavWillFocus();
        this.routeSubscription = DeviceEventEmitter.addListener('routeStateChanged', this.onRouteStateChanged);
        this.checkingAuth = true;
        await this.checkAuth();
    }

    componentWillUnmount() {
        this.routeSubscription.remove();
    }

    onRouteStateChanged = () => {
        this.onNavWillFocus();
    };

    async onNavWillFocus() {
        if (!this.onLoadExecuted) {
            this.onLoadExecuted = true;
            // Will only run once for each component
            if (this.checkingAuth) return;
            if (await this.checkAuth()) {
                // User is authenticated
                if (this.props.onLoad instanceof Function) this.props.onLoad();
            }
        }
        // Will most probably run multiple times
    }

    async checkAuth() {
        if (!await isAuthenticated()) {
            this.checkingAuth = false;
            this.props.navigate('Login');
            return false;
        }
        this.checkingAuth = false;
        return true;
    }

    render() {
        return (
            <>
                <NavigationEvents onWillFocus={() => this.onNavWillFocus()} />
                { this.props.showActivityIndicator && this.props.showActivityIndicator() ? 
                    <View style={styles.container}><ActivityIndicator size="large" color="#757de8"></ActivityIndicator></View> :
                    this.props.children
                }
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
});