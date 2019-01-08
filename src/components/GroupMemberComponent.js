import React from 'react';
import { Text, View, Button, Alert, TouchableWithoutFeedback } from 'react-native';
import { postBanUser, deleteUser } from '../network/group';
import Snackbar from 'react-native-snackbar';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class GroupMemberComponent extends React.Component {
    askBanMember() {
        Alert.alert(
            'Ban member',
            'Are you sure you want to ban ' + this.props.member.username + '?',
            [
                { text: 'Ban', onPress: () => this.banMember() },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: false }
        );
    }

    askKickMember() {
        Alert.alert(
            'Kick member',
            'Are you sure you want to kick ' + this.props.member.username + '?',
            [
                { text: 'Kick', onPress: () => this.kickMember() },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: false }
        );
    }

    async banMember() {
        if (this.submittingBanUser) return;
        this.submittingBanUser = true;
        let response = await postBanUser(this.props.groupId, this.props.member.username, true);
        this.submittingBanUser = false;

        if (response !== false) {
            Snackbar.show({
                title: this.props.member.username + ' was banned',
                duration: Snackbar.LENGTH_LONG,
                action: {
                    title: 'CLOSE',
                    color: 'green',
                    onPress: () => Snackbar.dismiss(),
                }
            });
            this.props.updateList();
        }
    }

    async kickMember() {
        if (this.submittingKickUser) return;
        this.submittingKickUser = true;
        let response = await deleteUser(this.props.groupId, this.props.member.username, true);
        this.submittingKickUser = false;

        if (response !== false) {
            Snackbar.show({
                title: this.props.member.username + ' was kicked',
                duration: Snackbar.LENGTH_LONG,
                action: {
                    title: 'CLOSE',
                    color: 'green',
                    onPress: () => Snackbar.dismiss(),
                }
            });
            this.props.updateList();
        }
    }

    render() {
        let style = { flexDirection: 'row', alignItems: 'center', marginBottom: 5 };
        if (this.props.showSeperator) {
            style.borderBottomWidth = 1;
            style.borderColor = 'lightgray';
            style.paddingBottom = 5;
        }
        return (
            <View style={style}>
                <Text>{this.props.member.firstname} {this.props.member.lastname}</Text>
                <Text style={{ flex: 1, marginLeft: 10 }}>({this.props.member.username})</Text>
                { this.props.showButtons &&
                <>
                    <View style={{ marginRight: 10 }}>
                        <TouchableWithoutFeedback onPress={() => this.askKickMember()}>
                            <MaterialCommunityIcon name="account-remove" color='#f44242' size={25} />
                        </TouchableWithoutFeedback>
                    </View>
                    <Button title="Ban" onPress={() => this.askBanMember()} color='#f44242'/>
                </>
                }
            </View>
        );
    }
}