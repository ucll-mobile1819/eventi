import React from 'react';
import { Text, TextInput, Button, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import groupStyles from '../styles/groupStyles';
import loginregisterStyles from '../styles/loginregister';

class JoinGroupScreen extends React.Component {
    render() {
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate}>
                <View style={{ flex: 1, padding: 20 }} >
                    <Text>Enter an invitecode here to join a group.</Text>
                    {/* {this.isFieldInError('invitecode') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('invitecode')[0]}</Text>} */}
                    <TextInput
                        style={groupStyles.inputField}
                        placeholder="Invitecode"
                        // value={this.state.inviteCode}
                        onChangeText={invitecode => this.setState({ invitecode })}
                    />
                    <Button
                        title="Join group"
                        onPress={() => this.joinGroup()}
                    />
                </View>
            </AuthenticatedComponent>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(JoinGroupScreen);