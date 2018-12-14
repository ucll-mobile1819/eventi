import React, { Component } from 'react';
import { Button, View, Text, TextInput, Alert } from 'react-native';
import loginregisterStyles from '../styles/loginregister';
import { isAuthenticated, setJWTToken, login } from '../auth';
import { NavigationEvents } from 'react-navigation';
import { postLogin } from '../network/auth';
import { fetchFailure } from '../actions';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    async onNavFocus() {
        if (await isAuthenticated()) {
            this.props.navigation.navigate('Groups'); // TODO: change to Home
        }
    }

    async login() {
        let response = await login(this.state.username, this.state.password);
        if (!response) return;
        this.props.navigation.navigate('Groups');
    }

    render() {
        return (
            <View style={{alignItems: 'center', flex: 1 }}>
                <NavigationEvents onDidFocus={() => this.onNavFocus()} />
                <Text style={loginregisterStyles.bigTitle}>Eventi</Text>
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
                <Button
                    title="Login"
                    onPress={() => this.login()}
                />
                <Text 
                    onPress={() => this.props.navigation.navigate('Register')}
                    style={{ color: 'darkblue', marginTop: 10 }}
                >Not a member yet? Register here.</Text>
            </View>
        );
    }
}