import React from 'react';
import { Text, Button, View, TextInput, Alert, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import { fetchGroup } from '../actions/GroupActions';
import ValidationComponent from '../components/ValidationComponent';
import loginregisterStyles from '../styles/loginregister';
import groupStyles from '../styles/groupStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ColorPalette from 'react-native-color-palette';
import { putGroup, putGenerateInviteCode, deleteGroup } from '../network/group';
import Snackbar from 'react-native-snackbar';


class GroupSettingsScreen extends ValidationComponent {
    static navigationOptions = obj => obj.navigation.state.params;

    constructor(props) {
        super(props);
        this.state = {
            showActivityIndicator: true,
            groupname: this.props.group.name,
            description: this.props.group.description,
            color: this.props.group.color
        };
    }

    onLoad() {
        this.props.fetchGroup(this.props.navigation.state.params.id)
            .then(() => {
                this.setState({ showActivityIndicator: false });
                if (this.props.error) return;
                this.props.navigation.setParams({
                    title: 'Settings',
                    customHeaderBackgroundColor: this.props.group.color,
                    headerTintColor: 'white', // Back arrow color
                    headerTitleStyle: { color: 'white' }, // Title color
                });
            });
    }

    async updateGroup() {
        if (!this.validateForm()) return;

        let response = await putGroup(
            this.props.group.id,
            this.state.groupname,
            this.state.description,
            this.state.color,
            true
        )

        if (response !== false) {
            Alert.alert('Group updated succesfully!');
            // TODO refresh state with group info
            // this.props.fetchGroup(this.props.navigation.state.params.id)
            // .then(() => this.setState({ ...this.props.group}));
            // this.props.navigation.push('Group', { id: this.props.group.id });
        }
    }

    validateForm() {
        if (!this.validate({
            groupname: { name: 'Group name', required: true, minlength: 2, maxlength: 50 },
            description: { name: 'Description', maxlength: 150 },
            color: { name: 'Color', required: true, color: true },
        })) {
            return false;
        }
        return true;
    }

    async copyToClipboard() {
        await Clipboard.setString(this.props.group.inviteCode);
        Snackbar.show({
            title: 'Invite code copied to clipboard',
            duration: Snackbar.LENGTH_LONG,
            action: {
                title: 'CLOSE',
                color: 'green',
                onPress: () => Snackbar.dismiss(),
            }
        });
    }

    async renewInviteCode() {
        let response = await putGenerateInviteCode(this.props.group.id, true);

        if (response !== false) {
            // TODO refresh inviteCode on screen

            Snackbar.show({
                title: 'Invite code renewed',
                duration: Snackbar.LENGTH_LONG,
                action: {
                    title: 'CLOSE',
                    color: 'green',
                    onPress: () => Snackbar.dismiss(),
                }
            });
        }
    }

    askDeleteGroup() {
        Alert.alert(
            'Delete group',
            'Are you sure that you want to delete this group?',
            [
                { text: 'Delete', onPress: () => this.deleteGroup() },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: false }
        );
    }

    async deleteGroup() {
        let response = deleteGroup(this.props.group.id, true);

        if (response !== false) {
            Snackbar.show({
                title: 'Group deleted',
                duration: Snackbar.LENGTH_LONG,
                action: {
                    title: 'CLOSE',
                    color: 'green',
                    onPress: () => Snackbar.dismiss(),
                }
            });
            this.setState({
                groupname: '',
                description: '',
                color: ''
            });
            this.props.navigation.push('Groups');
        }
    }

    showSnackBar(message) {
        
    }

    render() {
        return (
            <AuthenticatedComponent
                showActivityIndicator={() => this.state.showActivityIndicator}
                navigate={this.props.navigation.navigate}
                onLoad={this.onLoad.bind(this)}
            >
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    style={{ padding: 20 }}
                >
                    <Text style={groupStyles.subtitle}>Invite code</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 20, alignItems: 'center' }}>
                        <Text>{this.props.group.inviteCode}</Text>
                        <View style={{ marginLeft: 20, marginRight: 20 }}>
                            <Button title="Copy" onPress={() => this.copyToClipboard()} />
                        </View>
                        <Button title="Renew" onPress={() => this.renewInviteCode()} />
                    </View>

                    <Text style={groupStyles.subtitle}>Change group info</Text>
                    {this.isFieldInError('groupname') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('groupname')[0]}</Text>}
                    <TextInput
                        style={groupStyles.inputField}
                        placeholder="Group name"
                        value={this.state.groupname}
                        onChangeText={groupname => this.setState({ groupname })}
                    />
                    {this.isFieldInError('description') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('description')[0]}</Text>}
                    <TextInput
                        style={groupStyles.inputField}
                        placeholder="Description"
                        value={this.state.description}
                        onChangeText={description => this.setState({ description })}
                    />
                    {this.isFieldInError('color') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('color')[0]}</Text>}
                    <ColorPalette
                        onChange={color => this.setState({ color })}
                        value={this.props.group.color}
                        colors={['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
                            '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#000000']}
                        icon={<Text style={{ color: 'white' }}>✔</Text>}
                        title={''}
                    />
                    <Button
                        title="Save changes"
                        onPress={() => this.updateGroup()}
                    />

                    <Text style={[groupStyles.subtitle, { marginTop: 15 }]}>Delete group</Text>
                    <View style={{ marginBottom: 60 }}>
                        <Button title="Delete group" onPress={() => this.askDeleteGroup()} />
                    </View>
                </KeyboardAwareScrollView>
            </AuthenticatedComponent >
        );
    }
}

const mapStateToProps = state => {
    return {
        group: state.group.group,
        loading: state.group.loading,
        error: state.group.error
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchGroup
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupSettingsScreen);