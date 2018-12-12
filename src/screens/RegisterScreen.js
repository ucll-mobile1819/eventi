import React, { Component } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { customStyles } from '../styles/customStyles';
import { NavigationEvents } from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import { isAuthenticated } from '../auth';
import { postUser } from '../network/user';
import Snackbar from 'react-native-snackbar';

export default class RegisterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = this.getClearedState();
    }

    getClearedState() {
        return {
            firstname: '',
            lastname: '',
            username: '',
            birthday: null,
            password: '',
            passwordConfirmation: '',
        };
    }

    async onNavFocus() {
        this.setState(this.getClearedState());
        if (await isAuthenticated()) {
            this.props.navigation.navigate('Groups'); // TODO: change to Home
        }
    }

    async register() {
        // TODO: validation
        let response = await postUser(
            this.state.firstname,
            this.state.lastname,
            this.state.username,
            this.state.birthday,
            this.state.password,
            this.state.passwordConfirmation,
            true
        );
        if (response !== false) {
            Snackbar.show({
                title: 'Account succesfully created',
                duration: Snackbar.LENGTH_LONG,
                action: {
                    title: 'CLOSE',
                    color: 'green',
                    onPress: () => Snackbar.dismiss(),
                }
            });
            this.setState(this.getClearedState());
            this.props.navigation.navigate('Login');
        }
    }

    render() {
        return (
            <View style={{alignItems: 'center', flex: 1 }}>
                <NavigationEvents onDidFocus={() => this.onNavFocus()} />
                <Text style={customStyles.bigTitle}>Eventi</Text>
                <Text style={customStyles.smallTitle}>Register a new account</Text>
                <TextInput
                    style={customStyles.inputField}
                    placeholder="First name"
                    onChangeText={firstname => this.setState({ firstname })}
                    value={this.state.firstname}
                />
                <TextInput
                    style={customStyles.inputField}
                    placeholder="Last name"
                    onChangeText={lastname => this.setState({ lastname })}
                    value={this.state.lastname}
                />
                <TextInput
                    style={customStyles.inputField}
                    placeholder="Username"
                    onChangeText={username => this.setState({ username })}
                    value={this.state.username}
                />
                <DatePicker
                    style={customStyles.inputField}
                    placeholder="Birthday"
                    format="DD-MM-YYYY"
                    minDate="01-01-1900"
                    maxDate={new Date()}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    onDateChange={birthday => {this.setState({ birthday })}}
                    customStyles={{ dateInput: { borderWidth: 0 } }}
                    date={this.state.birthday}
                />
                <TextInput
                    style={customStyles.inputField}
                    secureTextEntry={true}
                    placeholder="Password"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                <TextInput
                    style={customStyles.inputField}
                    secureTextEntry={true}
                    placeholder="Repeat password"
                    onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
                    value={this.state.passwordConfirmation}
                />
                <Button title='Register' onPress={() => this.register()} />
            </View>
        );
    }
}