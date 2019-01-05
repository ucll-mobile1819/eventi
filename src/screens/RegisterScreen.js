import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { KeyboardAwareScrollView } from  'react-native-keyboard-aware-scroll-view';
import loginregisterStyles from '../styles/loginregister';
import { NavigationEvents } from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import { isAuthenticated } from '../auth';
import { postUser } from '../network/user';
import Snackbar from 'react-native-snackbar';
import ValidationComponent from '../components/ValidationComponent';
import { fetchFailure } from '../actions';

export default class RegisterScreen extends ValidationComponent {
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

    async onNavWillFocus() {
        this._resetErrors();
        this.setState(this.getClearedState());
        if (await isAuthenticated()) {
            this.props.navigation.navigate('Home');
        }
    }

    async register() {
        if (!this.validateForm()) return;

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

    validateForm() {
        if (!this.validate({
            firstname: { name: 'First name', required: true, minlength: 2, maxlength: 50 },
            lastname: { name: 'Last name', required: true, minlength: 2, maxlength: 50 },
            username: { name: 'Username', required: true, minlength: 3, maxlength: 15 },
            password: { name: 'Password', required: true },
            passwordConfirmation: { name: 'Password confirmation', required: true },
        })) {
            return false;
        }
        if (this.state.password !== this.state.passwordConfirmation) {
            fetchFailure({ status: 400, error: 'The fields Password and Password confirmation must match.' });
            return false;
        }
        return true;
    }

    render() {
        return (
            <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }} >
                <NavigationEvents onWillFocus={() => this.onNavWillFocus()} />
                <Text style={loginregisterStyles.bigTitle}>Eventi</Text>
                <Text style={loginregisterStyles.smallTitle}>Register a new account</Text>
                { this.isFieldInError('firstname') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('firstname')[0]}</Text> }
                <TextInput
                    style={loginregisterStyles.inputField}
                    placeholder="First name"
                    onChangeText={firstname => this.setState({ firstname })}
                    value={this.state.firstname}
                />
                { this.isFieldInError('lastname') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('lastname')[0]}</Text> }
                <TextInput
                    style={loginregisterStyles.inputField}
                    placeholder="Last name"
                    onChangeText={lastname => this.setState({ lastname })}
                    value={this.state.lastname}
                />
                { this.isFieldInError('username') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('username')[0]}</Text> }
                <TextInput
                    style={loginregisterStyles.inputField}
                    placeholder="Username"
                    onChangeText={username => this.setState({ username })}
                    value={this.state.username}
                />
                { this.isFieldInError('birthday') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('birthday')[0]}</Text> }
                <DatePicker
                    style={loginregisterStyles.inputField}
                    placeholder="Birthday"
                    format="DD-MM-YYYY"
                    minDate="01-01-1900"
                    maxDate={new Date()}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    onDateChange={ birthday => {
                        birthday = new Date(birthday.split('-').reverse().join('-'));
                        this.setState({ birthday });
                    }}
                    customStyles={{ dateInput: { borderWidth: 0, alignItems: 'flex-start', paddingLeft: 2 }}}
                    date={this.state.birthday}
                />
                { this.isFieldInError('password') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('password')[0]}</Text> }
                <TextInput
                    style={loginregisterStyles.inputField}
                    secureTextEntry={true}
                    placeholder="Password"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                { this.isFieldInError('passwordConfirmation') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('passwordConfirmation')[0]}</Text> }
                <TextInput
                    style={loginregisterStyles.inputField}
                    secureTextEntry={true}
                    placeholder="Repeat password"
                    onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
                    value={this.state.passwordConfirmation}
                />
                <Button title='Register' onPress={() => this.register()} />
                <Text 
                    onPress={() => this.props.navigation.navigate('Login')}
                    style={{ color: 'darkblue', marginTop: 10 }}
                >Already registered? Login here.</Text>
            </KeyboardAwareScrollView>
        );
    }
}