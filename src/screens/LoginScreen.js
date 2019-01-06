import React, { Component } from 'react';
import { Button, View, Text, TextInput } from 'react-native';
import loginregisterStyles from '../styles/loginregister';
import { isAuthenticated } from '../auth';
import { NavigationEvents } from 'react-navigation';
import { fetchLogin, fetchUser } from '../actions/AuthenticationActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MountCheckingComponent from '../components/MountCheckingComponent';

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    async onNavWillFocus() {
        if (await isAuthenticated()) {
            if (this.props.user.username === '') await this.props.fetchUser();
            this.props.navigation.navigate('Home');
        }
    }

    async login() {
        this.props.fetchLogin(this.state.username, this.state.password)
        .then(() => {
            if (!this.props.error) this.props.navigation.navigate('Home');
        });
    }

    render() {
        return (
            <MountCheckingComponent setMounted={val => { this._ismounted = val; }}>
                <View style={{alignItems: 'center', flex: 1 }}>
                    <NavigationEvents onWillFocus={() => this.onNavWillFocus()} />
                    <Text style={loginregisterStyles.bigTitle}>Eventi</Text>
                    <TextInput
                        style={loginregisterStyles.inputField}
                        placeholder="Username"
                        value={this.state.username}
                        onChangeText={username => this.updateState({ username })}
                    />
                    <TextInput
                        style={loginregisterStyles.inputField}
                        secureTextEntry={true}
                        placeholder="Password"
                        value={this.state.password}
                        onChangeText={password => this.updateState({ password })}
                    />
                    <Button
                        title="Login"
                        onPress={() => this.login()}
                    />
                    <Text 
                        onPress={() => this.props.navigation.navigate('Register')}
                        style={{ color: 'darkblue', marginTop: 10 }}
                    >Not a member yet? Register here.</Text>
                </View>
            </MountCheckingComponent>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        error: state.user.error,
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchLogin,
        fetchUser,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);