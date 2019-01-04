import React from 'react';
import { Text, Button } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import { fetchLogout } from '../actions/AuthenticationActions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ValidationComponent from '../components/ValidationComponent';

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
                    <Text>Change User Info</Text>
                    <Button title="Change Info" onPress={() => this.changeInfo()} />
                    <Text>Change Password</Text>
                    <Button title="Change Password" onPress={() => this.changePassword()} />
                    <Text>Logout</Text>
                    <Button title="Logout" onPress={() => this.logout()} color="#f44242" />
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