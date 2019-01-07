import React from 'react';
import { Text, TextInput, Button, View, Alert, Clipboard } from 'react-native';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import groupStyles from '../styles/groupStyles';
import loginregisterStyles from '../styles/loginregister';
import ValidationComponent from '../components/ValidationComponent';
import { postJoinGroup } from '../network/group';
import { fetchGroups } from '../actions/GroupActions';
import { fetchEventsOfGroup } from '../actions/EventActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class JoinGroupScreen extends ValidationComponent {
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
        return { invitecode: '' };
    }

    async joinGroup() {
        if (!this.validateForm()) return;

        let response = await postJoinGroup(this.state.invitecode, true);

        if (response !== false) {
            Alert.alert(
                'Group joined',
                'You succesfully joined ' + response.name + '.'
            );
            this.updateState(this.getClearedState());
            // fetch groups overview and group events so they show up when first joining the group
            let promises = [
                this.props.fetchGroups(),
                this.props.fetchEventsOfGroup(response.id)
            ]
            Promise.all(promises)
                .then(() => this.props.navigation.navigate('Group', { id: response.id }));
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
        this.updateState({ invitecode });
    }

    render() {
        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} navigate={this.props.navigation.navigate}>
                <View style={{ flex: 1, padding: 20 }} >
                    <Text style={{ marginBottom: 5 }}>Enter an invite code to join a group:</Text>
                    {this.isFieldInError('invitecode') && <Text style={{ ...loginregisterStyles.inputError, marginBottom: 5, marginLeft: 3 }}>{this.getErrorsInField('invitecode')[0]}</Text>}
                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <TextInput
                            style={[groupStyles.inputField, { marginBottom: -10, marginTop: -2, marginRight: 10, flex: 1 }]}
                            placeholder="Invite code"
                            value={this.state.invitecode}
                            onChangeText={invitecode => this.updateState({ invitecode })}
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

const mapStateToProps = state => {
    return {
        loading: state.group.loading,
        error: state.group.error,
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchGroups, fetchEventsOfGroup
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(JoinGroupScreen);