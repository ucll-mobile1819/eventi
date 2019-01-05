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
import DatePicker from 'react-native-datepicker';
import { fetchUser } from '../actions/AuthenticationActions';
import { putUser } from '../network/user';
import Snackbar from 'react-native-snackbar';
import { fetchFailure } from '../actions';

class ProfileScreen extends ValidationComponent {
    static navigationOptions = obj => obj.navigation.state.params;

    constructor(props) {
        super(props);
        this.state = this.getClearedState();
    }

    getClearedState() {
        return {
            password: '',
            passwordConfirmation: '',
            firstname: '',
            lastname: '',
            birthday: null
        };
    }

    onLoad() {
        this.props.navigation.setParams({
            title: this.props.user.firstname + ' ' + this.props.user.lastname,
        });

        this.props.fetchUser()
            .then(() => this.setState({ ...this.props.user }));
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
                title: 'Password succesfully updated',
                duration: Snackbar.LENGTH_LONG,
                action: {
                    title: 'CLOSE',
                    color: 'green',
                    onPress: () => Snackbar.dismiss(),
                }
            });
            this.props.fetchUser()
                .then(() => this.setState({ ...this.props.user }))
                .then(() => this.props.navigation.setParams({
                    title: this.state.firstname + ' ' + this.state.lastname,
                }));
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
                title: 'Account succesfully updated',
                duration: Snackbar.LENGTH_LONG,
                action: {
                    title: 'CLOSE',
                    color: 'green',
                    onPress: () => Snackbar.dismiss(),
                }
            });
            this.props.fetchUser()
                .then(() => this.setState({ ...this.props.user }));
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


    render() {
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} style={{ padding: 20 }}  >
                    <Text style={groupStyles.title}> Change User Info</Text>
                    {this.isFieldInError('firstname') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('firstname')[0]}</Text>}
                    <TextInput
                        style={[groupStyles.inputField, { flex: 1 }]}
                        onChangeText={firstname => this.setState({ firstname })}
                        value={this.state.firstname}
                    />
                    {this.isFieldInError('lastname') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('lastname')[0]}</Text>}
                    <TextInput
                        style={[groupStyles.inputField, { flex: 1 }]}
                        onChangeText={lastname => this.setState({ lastname })}
                        value={this.state.lastname}
                    />
                    <DatePicker
                        style={[groupStyles.inputField, { flex: 1, width: undefined }]}
                        format="DD-MM-YYYY"
                        minDate="01-01-1900"
                        placeholder="Birthday"
                        maxDate={new Date()}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={birthday => {
                            birthday = new Date(birthday.split('-').reverse().join('-'));
                            this.setState({ birthday });
                        }}
                        customStyles={{ dateInput: { borderWidth: 0, alignItems: 'flex-start', paddingLeft: 2 } }}
                        date={this.state.birthday}
                    />
                    <Button title="Change Info" onPress={() => this.changeInfo()} />

                    <Text style={groupStyles.title}>Change Password</Text>
                    { this.isFieldInError('password') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('password')[0]}</Text> }
                    <TextInput
                        style={[groupStyles.inputField, { flex: 1 }]}
                        secureTextEntry={true}
                        onChangeText={password => this.setState({ password })}
                        value={this.state.password}
                    />
                    { this.isFieldInError('passwordConfirmation') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('passwordConfirmation')[0]}</Text> }
                    <TextInput
                        style={[groupStyles.inputField, { flex: 1 }]}
                        secureTextEntry={true}
                        onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
                        value={this.state.passwordConfirmation}
                    />
                    <Button title="Change Password" onPress={() => this.changePassword()} />

                    <Text style={groupStyles.title}>Logout</Text>
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