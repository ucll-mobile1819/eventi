import React, { Component } from 'react';
import { Button, View, Text, TextInput } from 'react-native';
import { customStyles } from '../styles/customStyles';

export class LoginScreen extends Component {
    render() {
        return (
            <View style={{alignItems: 'center', flex: 1 }}>
                <Text style={customStyles.bigTitle}>Eventi</Text>
                <TextInput style={customStyles.inputField} placeholder="Username"/>
                <TextInput style={customStyles.inputField} secureTextEntry={true} placeholder="Password" />
                <Text>Not a member yet? Register here.</Text>
            </View>
        );
    }
}