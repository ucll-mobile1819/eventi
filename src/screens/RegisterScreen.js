import React, { Component } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { customStyles } from '../styles/customStyles';

export class RegisterScreen extends Component {
    render() {
        return (
            <View style={{alignItems: 'center', flex: 1 }}>
                <Text style={customStyles.bigTitle}>Eventi</Text>
                <Text style={customStyles.smallTitle}>Register a new account</Text>
                <TextInput style={customStyles.inputField} placeholder="First name"/>
                <TextInput style={customStyles.inputField} placeholder="Last name"/>
                <TextInput style={customStyles.inputField} placeholder="Username"/>
                <TextInput style={customStyles.inputField} placeholder="Email"/>
                <TextInput style={customStyles.inputField} placeholder="Birth date"/>
                <TextInput style={customStyles.inputField} placeholder="Username"/>
                <TextInput style={customStyles.inputField} secureTextEntry={true} placeholder="Password" />
                <TextInput style={customStyles.inputField} secureTextEntry={true} placeholder="Repeat password" />
                <Button title='Register' onPress={() => Alert.alert('Register placeholder')} />
            </View>
        );
    }
}