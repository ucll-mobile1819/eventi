import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { KeyboardAwareScrollView } from  'react-native-keyboard-aware-scroll-view';
import loginregisterStyles from '../styles/loginregister';
import { NavigationEvents } from 'react-navigation';
import { isAuthenticated } from '../auth';
import { postUser } from '../network/user';
import Snackbar from 'react-native-snackbar';
import ValidationComponent from '../components/ValidationComponent';
import { fetchFailure } from '../actions';
import MountCheckingComponent from '../components/MountCheckingComponent';
import DatePickerComponent from '../components/DatePickerComponent';

export default class RegisterScreen extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = this.getClearedState();
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
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
        this.updateState(this.getClearedState());
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
            this.updateState(this.getClearedState());
            this.props.navigation.navigate('Login');
        }
    }

    formatDate(date) {
        // formats date to "DD-MM-YYYY"
        let dbl = num => num.toString().length == 2 ? num : '0' + num;
        return `${dbl(date.getDate())}-${dbl(date.getMonth()+1)}-${date.getFullYear()}`;
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
            <MountCheckingComponent setMounted={val => { this._ismounted = val; }}>
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }} >
                    <NavigationEvents onWillFocus={() => this.onNavWillFocus()} />
                    <Text style={loginregisterStyles.bigTitle}>Eventi</Text>
                    <Text style={loginregisterStyles.smallTitle}>Register a new account</Text>
                    { this.isFieldInError('firstname') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('firstname')[0]}</Text> }
                    <TextInput
                        style={loginregisterStyles.inputField}
                        placeholder="First name"
                        onChangeText={firstname => this.updateState({ firstname })}
                        value={this.state.firstname}
                        maxLength={50}
                    />
                    { this.isFieldInError('lastname') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('lastname')[0]}</Text> }
                    <TextInput
                        style={loginregisterStyles.inputField}
                        placeholder="Last name"
                        onChangeText={lastname => this.updateState({ lastname })}
                        value={this.state.lastname}
                        maxLength={50}
                    />
                    { this.isFieldInError('username') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('username')[0]}</Text> }
                    <TextInput
                        style={loginregisterStyles.inputField}
                        placeholder="Username"
                        onChangeText={username => this.updateState({ username })}
                        value={this.state.username}
                        maxLength={15}
                    />
                    { this.isFieldInError('birthday') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('birthday')[0]}</Text> }
                    <DatePickerComponent
                        style={loginregisterStyles.inputField}
                        placeholder="Birthday"
                        format={date => this.formatDate(date)}
                        minDate={new Date(1900, 0, 1)}
                        maxDate={new Date()}
                        onDateChange={ birthday => this.updateState({ birthday }) }
                        customStyles={{ dateInput: { borderWidth: 0, alignItems: 'flex-start', paddingLeft: 2 }}}
                        date={this.state.birthday}
                        mode='date'
                    />
                    { this.isFieldInError('password') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('password')[0]}</Text> }
                    <TextInput
                        style={loginregisterStyles.inputField}
                        secureTextEntry={true}
                        placeholder="Password"
                        onChangeText={password => this.updateState({ password })}
                        value={this.state.password}
                        maxLength={3000}
                    />
                    { this.isFieldInError('passwordConfirmation') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('passwordConfirmation')[0]}</Text> }
                    <TextInput
                        style={loginregisterStyles.inputField}
                        secureTextEntry={true}
                        placeholder="Repeat password"
                        onChangeText={passwordConfirmation => this.updateState({ passwordConfirmation })}
                        value={this.state.passwordConfirmation}
                        maxLength={3000}
                    />
                    <Button title='Register' onPress={() => this.register()} />
                    <Text 
                        onPress={() => this.props.navigation.navigate('Login')}
                        style={{ color: 'darkblue', marginTop: 10 }}
                    >Already registered? Login here.</Text>
                </KeyboardAwareScrollView>
            </MountCheckingComponent>
        );
    }
}