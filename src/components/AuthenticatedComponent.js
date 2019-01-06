import React, { Component } from "react";
import { DeviceEventEmitter, ActivityIndicator, View, StyleSheet } from 'react-native';
import { isAuthenticated } from "../auth";
import { NavigationEvents } from 'react-navigation';
import MountCheckingComponent from "./MountCheckingComponent";

export default class AuthenticatedComponent extends Component {
    constructor(props) {
        super(props);
        if (!this.props.showActivityIndicator) this.props.showActivityIndicator = () => false;
        this.checkingAuth = false;
        this.onLoadExecuted = false;
        this.isBackPause = false;
    }

    async componentDidMount() {
        this.onNavWillFocus();
        this.routeSubscription = DeviceEventEmitter.addListener('routeStateChanged', this.onRouteStateChanged);
        this.checkingAuth = true;
        await this.checkAuth();
    }

    componentWillUnmount() {
        this.routeSubscription.remove();
        if (this.props.onBack instanceof Function) this.props.onBack();
    }

    onRouteStateChanged = () => {
        this.onNavWillFocus();
    };

    async onNavWillFocus() {
        let back = this.props.isBack instanceof Function && this.props.isBack() && !this.isBackPause;
        if (!this.onLoadExecuted || back) {
            if (back) this.isBackPause = true;
            setTimeout(() => { this.isBackPause = false; }, 1000);
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
            <MountCheckingComponent setMounted={this.props.setMounted}>
                <NavigationEvents onWillFocus={() => this.onNavWillFocus()} />
                { this.props.showActivityIndicator && this.props.showActivityIndicator() ? 
                    <View style={styles.container}><ActivityIndicator size="large" color="#757de8"></ActivityIndicator></View> :
                    this.props.children
                }
            </MountCheckingComponent>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
});