import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import { fetchLogout } from '../actions/AuthenticationActions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ValidationComponent from '../components/ValidationComponent';
import loginregisterStyles from '../styles/loginregister';
import groupStyles from '../styles/groupStyles';
import profileStyles from '../styles/profileStyles';
import { fetchUser } from '../actions/AuthenticationActions';
import { putUser } from '../network/user';
import Snackbar from 'react-native-snackbar';
import { fetchFailure } from '../actions';
import DatePickerComponent from '../components/DatePickerComponent';

class ProfileScreen extends ValidationComponent {
    static navigationOptions = obj => obj.navigation.state.params;

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
            password: '',
            passwordConfirmation: '',
            firstname: '',
            lastname: '',
            birthday: null,
            showActivityIndicator: true
        };
    }

    onLoad() {
        this.props.navigation.setParams({
            title: this.props.user.firstname + ' ' + this.props.user.lastname,
        });

        this.props.fetchUser()
            .then(() => this.updateState({ ...this.props.user, showActivityIndicator: false }));
    }

    async logout() {
        await this.props.fetchLogout();
        this.props.navigation.navigate('Login');
    }

    async changePassword() {
        if (!this.validatePasswordForm()) return;

        let response = await putUser(
            null, null, null,
            this.state.password,
            this.state.passwordConfirmation,
            true
        );
        if (response !== false) {
            Snackbar.show({
                title: 'Password successfully updated',
                duration: Snackbar.LENGTH_LONG,
                action: {
                    title: 'CLOSE',
                    color: 'green',
                    onPress: () => Snackbar.dismiss(),
                }
            });
            this.props.fetchUser()
                .then(() => this.updateState({ ...this.props.user }));
        }
    }

    async changeInfo() {
        if (!this.validateInfoForm()) return;

        let response = await putUser(
            this.state.firstname,
            this.state.lastname,
            this.state.birthday,
            null, null, true
        );
        if (response !== false) {
            Snackbar.show({
                title: 'Account successfully updated',
                duration: Snackbar.LENGTH_LONG,
                action: {
                    title: 'CLOSE',
                    color: 'green',
                    onPress: () => Snackbar.dismiss(),
                }
            });
            this.props.fetchUser()
                .then(() => this.updateState({ ...this.props.user }))
                .then(() => this.props.navigation.setParams({
                    title: this.state.firstname + ' ' + this.state.lastname,
                }));
        }

    }

    validatePasswordForm() {
        if (!this.validate({
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

    validateInfoForm() {
        if (!this.validate({
            firstname: { name: 'First name', required: true, minlength: 2, maxlength: 50 },
            lastname: { name: 'Last name', required: true, minlength: 2, maxlength: 50 },
        })) {
            return false;
        }

        return true;
    }

    formatDate(date) {
        // formats date to "DD-MM-YYYY"
        let dbl = num => num.toString().length == 2 ? num : '0' + num;
        return `${dbl(date.getDate())}-${dbl(date.getMonth()+1)}-${date.getFullYear()}`;
    }

    render() {
        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} showActivityIndicator={() => this.state.showActivityIndicator} navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} style={{ padding: 20 }}  >
                    <Text style={profileStyles.title}> Change User Info</Text>
                    {this.isFieldInError('firstname') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('firstname')[0]}</Text>}
                    <TextInput
                        style={[groupStyles.inputField, { flex: 1 }]}
                        onChangeText={firstname => this.updateState({ firstname })}
                        value={this.state.firstname}
                        placeholder='First name'
                    />
                    {this.isFieldInError('lastname') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('lastname')[0]}</Text>}
                    <TextInput
                        style={[groupStyles.inputField, { flex: 1 }]}
                        onChangeText={lastname => this.updateState({ lastname })}
                        value={this.state.lastname}
                        placeholder='Last name'
                    />
                    <DatePickerComponent
                        style={[groupStyles.inputField, { flex: 1, width: undefined }]}
                        placeholder="Birthday"
                        format={date => this.formatDate(date)}
                        minDate={new Date(1900, 0, 1)}
                        maxDate={new Date()}
                        onDateChange={ birthday => this.updateState({ birthday }) }
                        customStyles={{ dateInput: { borderWidth: 0, alignItems: 'flex-start', paddingLeft: 2 }}}
                        date={this.state.birthday}
                        mode='date'
                    />
                    <View style={profileStyles.button}>
                        <Button title="Change Info" onPress={() => this.changeInfo()}/>
                    </View>

                    <Text style={profileStyles.title}>Change Password</Text>
                    { this.isFieldInError('password') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('password')[0]}</Text> }
                    <TextInput
                        style={[groupStyles.inputField, { flex: 1 }]}
                        secureTextEntry={true}
                        onChangeText={password => this.updateState({ password })}
                        value={this.state.password}
                        placeholder='Password'
                    />
                    { this.isFieldInError('passwordConfirmation') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('passwordConfirmation')[0]}</Text> }
                    <TextInput
                        style={[groupStyles.inputField, { flex: 1 }]}
                        secureTextEntry={true}
                        onChangeText={passwordConfirmation => this.updateState({ passwordConfirmation })}
                        value={this.state.passwordConfirmation}
                        placeholder='Password confirmation'
                    />
                    <View style={profileStyles.button}>
                        <Button title="Change Password" onPress={() => this.changePassword()}/>
                    </View>

                    <Text style={profileStyles.title}>Logout</Text>
                    <View style={{ paddingBottom: 70 }}>
                        <Button title="Logout" onPress={() => this.logout()} color="#f44242" />
                    </View>
                </KeyboardAwareScrollView>
            </AuthenticatedComponent>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchLogout, fetchUser,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);