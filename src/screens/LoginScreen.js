import React, { Component } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { customStyles } from '../styles/customStyles';
import { isAuthenticated, login } from '../auth';
import { NavigationEvents } from 'react-navigation';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    async onNavWillFocus() {
        if (await isAuthenticated()) {
            this.props.navigation.navigate('Home');
        }
    }

    async login() {
        let response = await login(this.state.username, this.state.password);
        if (!response) return;
        this.props.navigation.navigate('Home');
    }

    render() {
        return (
            <View style={{alignItems: 'center', flex: 1 }}>
                <NavigationEvents onWillFocus={() => this.onNavWillFocus()} />
                <Text style={customStyles.bigTitle}>Eventi</Text>
                <TextInput
                    style={customStyles.inputField}
                    placeholder="Username"
                    value={this.state.username}
                    onChangeText={username => this.setState({ username })}
                />
                <TextInput
                    style={customStyles.inputField}
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