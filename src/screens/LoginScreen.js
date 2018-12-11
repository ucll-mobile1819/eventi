import React, { Component } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { customStyles } from '../styles/customStyles';
import Button from '@material-ui/core/Button';

export default class LoginScreen extends Component {
    render() {
        return (
            <View style={{alignItems: 'center', flex: 1 }}>
                <Text style={customStyles.bigTitle}>Eventi</Text>
                <TextInput style={customStyles.inputField} placeholder="Username"/>
                <TextInput style={customStyles.inputField} secureTextEntry={true} placeholder="Password" />
                
            </View>
        );
    }
}