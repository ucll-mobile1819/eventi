import React from 'react';
import { Text, Button, View, TextInput, Alert, Clipboard, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Container, Tab, Tabs, H3 } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import { fetchGroup, fetchGroups, fetchMembers, fetchBannedUsers } from '../actions/GroupActions';
import ValidationComponent from '../components/ValidationComponent';
import loginregisterStyles from '../styles/loginregister';
import groupStyles from '../styles/groupStyles';
import GroupMemberComponent from '../components/GroupMemberComponent';
import GroupMemberBannedComponent from '../components/GroupMemberBannedComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ColorPalette from 'react-native-color-palette';
import { putGroup, putGenerateInviteCode, deleteGroup, deleteUser } from '../network/group';
import Snackbar from 'react-native-snackbar';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import headerStyles from '../styles/headerStyles';


class GroupSettingsScreen extends ValidationComponent {
    static navigationOptions = obj => obj.navigation.state.params;

    constructor(props) {
        super(props);
        this.state = {
            showActivityIndicator: true,
            groupname: this.props.group.name,
            description: this.props.group.description,
            color: this.props.group.color,
            inviteCode: this.props.group.inviteCode
        };
    }

    onLoad(updateHeader = true) {
        // group has to be fetched first to be able to determine isOwner()
        this.props.fetchGroup(this.props.navigation.state.params.id)
        .then(() => {
            let promises = [];
            promises.push(this.props.fetchMembers(this.props.navigation.state.params.id));
            if (this.isOwner()) promises.push(this.props.fetchBannedUsers(this.props.navigation.state.params.id));
            Promise.all(promises)
                .then(() => {
                    this.updateState({ showActivityIndicator: false });
                    if (this.props.error) return;
                    if (updateHeader) this.updateHeader();
                });
        });
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    updateHeader() {
        let headerRight = this.isOwner() ? undefined : (
            <View {...headerStyles.iconContainer}>
                <TouchableWithoutFeedback onPress={() => this.askLeaveGroup()}>
                    <MaterialIcon name='exit-to-app' {...headerStyles.iconProps2} />
                </TouchableWithoutFeedback>
            </View>
        );
        this.props.navigation.setParams({
            title: 'Settings',
            customHeaderBackgroundColor: this.state.color,
            headerTintColor: 'white', // Back arrow color
            headerTitleStyle: { color: 'white' }, // Title color
            headerRight,
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
            this.props.fetchGroup(response.id)
                .then(() => this.updateState({ ...this.props.group }))
                .then(() => this.props.fetchGroups())
                .then(() => this.props.navigation.navigate('Group', { id: response.id }));

            this.showSnackBar('Group updated');
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
        this.showSnackBar('Invite code copied to clipboard');
    }

    async renewInviteCode() {
        let response = await putGenerateInviteCode(this.props.group.id, true);

        if (response !== false) {
            this.updateState({ inviteCode: response.inviteCode });
            this.showSnackBar('Invite code renewed');
        }
    }

    askDeleteGroup() {
        Alert.alert(
            'Delete group',
            'Are you sure you want to delete this group?',
            [
                { text: 'Delete', onPress: () => this.deleteGroup() },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: false }
        );
    }

    async deleteGroup() {
        let response = await deleteGroup(this.props.group.id, true);

        if (response !== false) {
            // this.showSnackBar('Group deleted'); // Not working
            Alert.alert('Group deleted', 'The group was successfully deleted.');
            this.updateState({
                groupname: '',
                description: '',
                color: ''
            });
            this.props.fetchGroups()
                .then(() => this.props.navigation.navigate('Groups'));
        }
    }

    showSnackBar(message) {
        Snackbar.show({
            title: message,
            duration: Snackbar.LENGTH_LONG,
            action: {
                title: 'CLOSE',
                color: 'green',
                onPress: () => Snackbar.dismiss(),
            }
        });
    }

    isOwner() {
        return this.props.user.username === this.props.group.creator;
    }

    askLeaveGroup() {
        Alert.alert(
            'Leave group',
            'Are you sure you want to leave this group?',
            [
                { text: 'Leave', onPress: () => this.leaveGroup() },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: false }
        );
    }

    async leaveGroup() {
        let response = await deleteUser(this.props.group.id, this.props.user.username);

        if (response !== false) {
            Alert.alert('Group left', 'You left the group successfully.');
            this.updateState({
                groupname: '',
                description: '',
                color: ''
            });
            this.props.fetchGroups()
                .then(() => this.props.navigation.navigate('Groups'));
        }
    }

    showButtons(user) {
        return this.isOwner() && user.username !== this.props.user.username;
    }

    render() {
        return (
            <AuthenticatedComponent
                showActivityIndicator={() => this.state.showActivityIndicator}
                navigate={this.props.navigation.navigate}
                onLoad={this.onLoad.bind(this)}
                setMounted={val => { this._ismounted = val; }}
            >
                <Container>
                    <Tabs>
                        {this.isOwner() &&
                            <Tab heading="General">
                                    <KeyboardAwareScrollView
                                        resetScrollToCoords={{ x: 0, y: 0 }}
                                        style={{ padding: 20 }}
                                    >
                                        <Text style={groupStyles.subtitle}>Invite code</Text>
                                        <View style={{ flexDirection: 'row', marginBottom: 20, alignItems: 'center' }}>
                                            <Text>{this.state.inviteCode}</Text>
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
                                            onChangeText={groupname => this.updateState({ groupname })}
                                        />
                                        {this.isFieldInError('description') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('description')[0]}</Text>}
                                        <TextInput
                                            style={groupStyles.inputField}
                                            placeholder="Description"
                                            value={this.state.description}
                                            onChangeText={description => this.updateState({ description })}
                                        />
                                        {this.isFieldInError('color') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('color')[0]}</Text>}
                                        <ColorPalette
                                            onChange={color => this.updateState({ color }, () => this.updateHeader())}
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
                                            <Button title="Delete group" onPress={() => this.askDeleteGroup()} color='#f44242' />
                                        </View>
                                    </KeyboardAwareScrollView>
                            </Tab>
                        }
                        <Tab heading="Members">
                            <FlatList
                                data={this.props.members}
                                renderItem={({ item, index }) => 
                                    <GroupMemberComponent
                                        updateList={() => this.onLoad(false)}
                                        showSeperator={this.props.members.length - 1 !== index}
                                        member={item} 
                                        groupId={this.props.group.id}
                                        showButtons={this.showButtons(item)}
                                    />
                                }
                                keyExtractor={member => String(member.username)}
                                style={{ padding: 20 }}
                            />
                        </Tab>
                        {this.isOwner() &&
                            <Tab heading="Banned">
                                <FlatList
                                    data={this.props.bannedUsers}
                                    renderItem={({ item, index }) => 
                                        <GroupMemberBannedComponent
                                            updateList={() => this.onLoad(false)}
                                            showSeperator={this.props.bannedUsers.length - 1 !== index}
                                            member={item} 
                                            groupId={this.props.group.id}
                                        />
                                    }
                                    keyExtractor={member => String(member.username)}
                                    style={{ padding: 20 }}
                                />
                            </Tab>
                        }
                    </Tabs>
                </Container>
            </AuthenticatedComponent >
        );
    }
}

const mapStateToProps = state => {
    return {
        group: state.group.group,
        loading: state.group.loading,
        error: state.group.error,
        members: state.group.members,
        bannedUsers: state.group.bannedUsers,
        user: state.user.user
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchGroup, fetchGroups, fetchMembers, fetchBannedUsers
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupSettingsScreen);