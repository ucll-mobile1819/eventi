import React from 'react';
import { Text, TextInput, Button, View, Alert } from 'react-native';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import groupStyles from '../styles/groupStyles';
import loginregisterStyles from '../styles/loginregister';
import ValidationComponent from '../components/ValidationComponent';
import { postJoinGroup } from '../network/group';

export default class JoinGroupScreen extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = this.getClearedState();
    }

    getClearedState() {
        return { invitecode: '' };
    }

    async joinGroup() {
        if (!this.validateForm()) return;

        let response = await postJoinGroup(this.state.invitecode, true);

        // TODO check if a group was found / joining was successful
        // TODO owner shouldn't be able to join his own group
        if (response !== false) {
            // TODO show group name when join was succesful

            Alert.alert('Group succesfully joined!');
            // this.setState(this.getClearedState());
            // this.props.navigation.push('Groups');
        }
    }

    validateForm() {
        if (!this.validate({
            invitecode: { name: 'Invitecode', required: true, invitecode: true },
        })) {
            return false;
        }
        return true;
    }

    render() {
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate}>
                <View style={{ flex: 1, padding: 20 }} >
                    <Text>Enter an invitecode here to join a group.</Text>
                    {this.isFieldInError('invitecode') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('invitecode')[0]}</Text>}
                    <TextInput
                        style={groupStyles.inputField}
                        placeholder="Invitecode"
                        value={this.state.inviteCode}
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