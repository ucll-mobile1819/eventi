import React from 'react';
import { Text, TextInput, Button, View, Alert, Clipboard } from 'react-native';
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

        if (response !== false) {
            Alert.alert(
                'Group joined',
                'You succesfully joined ' + response.name
            );
            this.setState(this.getClearedState());
            this.props.navigation.push('Groups');
        }
    }

    validateForm() {
        if (!this.validate({
            invitecode: { name: 'Invite code', required: true, invitecode: true },
        })) {
            return false;
        }
        return true;
    }

    async pasteFromClipboard() {
        const invitecode = await Clipboard.getString();
        this.setState({ invitecode });
    }

    render() {
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate}>
                <View style={{ flex: 1, padding: 20 }} >
                    <Text style={{ marginBottom: 5 }}>Enter an invite code to join a group:</Text>
                    {this.isFieldInError('invitecode') && <Text style={{...loginregisterStyles.inputError, marginBottom: 5, marginLeft: 3}}>{this.getErrorsInField('invitecode')[0]}</Text>}
                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <TextInput
                            style={[groupStyles.inputField, {marginBottom: -10, marginTop: -2, marginRight: 10, flex: 1}]}
                            placeholder="Invite code"
                            value={this.state.invitecode}
                            onChangeText={invitecode => this.setState({ invitecode })}
                        />
                        <Button
                            title="Paste"
                            onPress={() => this.pasteFromClipboard()}
                        />
                    </View>
                    <Button
                        title="Join group"
                        onPress={() => this.joinGroup()}
                    />
                </View>
            </AuthenticatedComponent>
        );
    }
}