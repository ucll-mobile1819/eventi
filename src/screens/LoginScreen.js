import React, { Component } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import loginregisterStyles from '../styles/loginregister';
import { isAuthenticated, login } from '../auth';
import { NavigationEvents } from 'react-navigation';

export default class LoginScreen extends Component {
    constructor(props) {
        console.log('LOADING LOGIN SCREEN------');
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    async onNavWillFocus() {
        console.log('ON NAV WILL FOCUS');
        if (await isAuthenticated()) {
            console.log('YOU ARE AUTHENTICATED');
            this.props.navigation.navigate('Home');
        }
    }

    async login() {
        let response = await login(this.state.username, this.state.password);
        if (!response) return;
        console.log('NAVIGATING TO HOME...');
        this.props.navigation.navigate('Home');
    }

    render() {
        return (
            <View style={{alignItems: 'center', flex: 1 }}>
                <NavigationEvents onWillFocus={() => this.onNavWillFocus()} />
                <Text style={customStyles.bigTitle}>Eventi</Text>
                <TextInput
                    style={loginregisterStyles.inputField}
                    placeholder="Username"
                    value={this.state.username}
                    onChangeText={username => this.setState({ username })}
                />
                <TextInput
                    style={loginregisterStyles.inputField}
                    secureTextEntry={true}
                    placeholder="Password"
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                /> 
                <Text 
                    onPress={() => this.props.navigation.navigate('Register')}
                    style={{ color: 'darkblue', marginTop: 10 }}
                >Not a member yet? Register here.</Text>
            </View>
        );
    }
}