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
            username: '',
            firstname: '',
            lastname: '',
            birthday: null
        };
    }

    onLoad() {
        this.props.navigation.setParams({
            title: this.props.user.firstname + ' ' + this.props.user.lastname,
        });
    }

    async logout() {
        await this.props.fetchLogout();
        this.props.navigation.navigate('Login');
    }

    async changePassword() {

    }

    async changeInfo() {

    }

    validatePasswordForm() {

    }

    validateInfoForm() {

    }


    render() {
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} style={{ padding: 20 }}  >
                    <Text style={groupStyles.title}> Change User Info</Text>
                    <TextInput
                        style={[groupStyles.inputField, { flex: 1 }]}
                        onChangeText={firstname => this.setState({ firstname })}
                        value={this.state.firstname}
                    />
                    <TextInput
                        style={[groupStyles.inputField, { flex: 1 }]}
                        onChangeText={lastname => this.setState({ lastname })}
                        value={this.state.lastname}
                    />
                    <DatePicker
                        style={[groupStyles.inputField, { flex: 1, width: undefined }]}
                        format="DD-MM-YYYY"
                        minDate="01-01-1900"
                        maxDate={new Date()}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={birthday => { this.setState({ birthday }) }}
                        customStyles={{ dateInput: { borderWidth: 0, alignItems: 'flex-start', paddingLeft: 2 } }}
                        date={this.state.birthday}
                    />
                    <Button title="Change Info" onPress={() => this.changeInfo()} />

                    <Text style={groupStyles.title}>Change Password</Text>
                    <TextInput
                        style={[groupStyles.inputField, { flex: 1 }]}
                        secureTextEntry={true}
                        onChangeText={password => this.setState({ password })}
                        value={this.state.password}
                    />
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
        fetchLogout,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);