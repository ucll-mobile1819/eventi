import React from 'react';
import { Text, TextInput, Button } from 'react-native';
import { KeyboardAwareScrollView } from  'react-native-keyboard-aware-scroll-view';
import { NavigationEvents } from 'react-navigation';
import loginregisterStyles from '../styles/loginregister';
import { postGroup } from '../network/group';
import ValidationComponent from '../components/ValidationComponent';
import { isAuthenticated } from '../auth';
import Snackbar from 'react-native-snackbar';

export default class CreateGroupScreen extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = this.getClearedState();
    }

    getClearedState() {
        return {
            groupname: '',
            description: '',
            color: '#FFF'
        };
    }

    async createGroup() {
        if (!this.validateForm()) return;

        let response = await postGroup(
            this.state.groupname, 
            this.state.description, 
            this.state.color
        );

        if (response !== false) {
            Snackbar.show({
                title: 'Group succesfully created',
                duration: Snackbar.LENGTH_LONG,
                action: {
                    title: 'CLOSE',
                    color: 'green',
                    onPress: () => Snackbar.dismiss(),
                }
            });
            this.setState(this.getClearedState());
            this.props.navigation.push('Groups');
        }
    }

    validateForm() {
        if (!this.validate({
            groupname: { name: 'Group name', required: true, minlength: 2, maxlength: 50 },
            description: { name: 'Description', required: true, minlength: 2, maxlength: 150 },
            color: { name: 'Color', required: true, color: true},
        })) {
            return false;
        }
        return true;
    }

    async onNavWillFocus() {
        this._resetErrors();
        this.setState(this.getClearedState());
        if (await isAuthenticated()) {
            this.props.navigation.navigate('Groups'); // ?
        }
    }

    render() {
        return (
            <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }} >
                {/* <NavigationEvents onWillFocus={() => this.onNavWillFocus()} /> */}
                { this.isFieldInError('groupname') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('groupname')[0]}</Text> }
                <TextInput
                    style={loginregisterStyles.inputField}
                    placeholder="Group name"
                    value={this.state.groupname}
                    onChangeText={groupname => this.setState({ groupname })}
                />
                { this.isFieldInError('description') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('description')[0]}</Text> }
                <TextInput
                    style={loginregisterStyles.inputField}
                    placeholder="Description"
                    value={this.state.description}
                    onChangeText={description => this.setState({ description })}
                />
                { this.isFieldInError('color') && <Text style={loginregisterStyles.inputError}>{this.getErrorsInField('color')[0]}</Text> }
                <TextInput
                    style={loginregisterStyles.inputField}
                    placeholder="Color"
                    value={this.state.color}
                    onChangeText={color => this.setState({ color })}
                />
                <Button
                    title="Create group"
                    onPress={() => this.createGroup()}
                />
            </KeyboardAwareScrollView>
        );
    }
}