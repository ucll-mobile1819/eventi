import React, { Component } from 'react';
import { Button, View, Text, TextInput, Alert } from 'react-native';
import { customStyles } from '../styles/customStyles';

export default class LoginScreen extends Component {
    render() {
        return (
            <View style={{alignItems: 'center', flex: 1 }}>
                <Text style={customStyles.bigTitle}>Eventi</Text>
                <TextInput style={customStyles.inputField} placeholder="Username"/>
                <TextInput style={customStyles.inputField} secureTextEntry={true} placeholder="Password" />
                <Button title="Login" onPress={() => Alert.alert('Login placeholder')}/>
                <Button
                    title="Not a member yet? Register here."
                    onPress={() => this.props.navigation.navigate('Register')}
                />
                <Button
                    title="Check out the groups test screen"
                    onPress={() => this.props.navigation.navigate('Groups')}
                />
            </View>
        );
    }
}