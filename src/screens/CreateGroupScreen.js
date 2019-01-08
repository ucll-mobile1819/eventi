import React from 'react';
import { Text, TextInput, Button, Alert, Clipboard, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationEvents } from 'react-navigation';
import { postGroup } from '../network/group';
import ValidationComponent from '../components/ValidationComponent';
import { isAuthenticated } from '../auth';
import ColorPalette from 'react-native-color-palette';
import Snackbar from 'react-native-snackbar';
import groupStyles from '../styles/groupStyles';
import loginregisterStyles from '../styles/loginregister';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

export default class CreateGroupScreen extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = this.getClearedState();
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    getClearedState() {
        return {
            groupname: '',
            description: '',
            color: '#F44336'
        };
    }

    async createGroup() {
        if (!this.validateForm()) return;

        let response = await postGroup(
            this.state.groupname,
            this.state.description,
            this.state.color
        )
        if (response !== false) {
            Alert.alert(
                'Group succesfully created',
                'Share the following code to invite people to your group: ' + response.inviteCode,
                [
                    { text: 'Copy link to clipboard', onPress: () => this.createGroupDone(response.inviteCode) },
                    { text: 'Ok', onPress: () => this.createGroupDone(false) }
                ],
                { cancelable: false }
            );
        }
    }

    async createGroupDone(inviteCode) {
        if (inviteCode) {
            await Clipboard.setString(inviteCode);
            Alert.alert('Invite code copied to clipboard!')

            // TODO snackbar not showing
            // Snackbar.show({
            //     title: 'Link copied to clipboard',
            //     duration: Snackbar.LENGTH_LONG,
            //     action: {
            //         title: 'CLOSE',
            //         color: 'green',
            //         onPress: () => Snackbar.dismiss(),
            //     }
            // });
        }
        this.updateState(this.getClearedState());
        this.props.navigation.push('Groups');
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

    async onNavWillFocus() {
        this._resetErrors();
        this.updateState(this.getClearedState());
        if (await isAuthenticated()) {
            this.props.navigation.navigate('Groups'); // ?
        }
    }

    render() {
        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} navigate={this.props.navigation.navigate}>
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }} >
                    {/* <NavigationEvents onWillFocus={() => this.onNavWillFocus()} /> */}
                    <View style={{ flex: 1, padding: 20 }} >
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
                        <Text style={groupStyles.subtitle}>Pick a group color</Text>
                        {this.isFieldInError('color') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('color')[0]}</Text>}
                        <ColorPalette
                            onChange={color => this.updateState({ color })}
                            colors={['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
                                '#8BC34A', '#CDDC39', /*'#FFE105'*/, '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#000000']}
                            icon={<Text style={{ color: 'white' }}>✔</Text>}
                            title={''}
                        />
                        <Button
                            title="Create group"
                            onPress={() => this.createGroup()}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </AuthenticatedComponent>
        );
    }
}