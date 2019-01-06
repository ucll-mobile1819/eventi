import React from 'react';
import { Text, View, Button, Alert } from 'react-native';
import { postBanUser } from '../network/group';
import Snackbar from 'react-native-snackbar';

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

    async banMember() {
        let response = await postBanUser(this.props.groupId, this.props.member.username, true);

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
            // TODO refresh memberlist of group
        }
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <Text>{this.props.member.firstname} {this.props.member.lastname}</Text>
                <Text style={{ flex: 1, marginLeft: 10 }}>({this.props.member.username})</Text>
                <Button title="Ban" onPress={() => this.askBanMember()} />
            </View>
        );
    }
}