import React from 'react';
import { Text, View, Button, Alert } from 'react-native';
import { postUnbanUser } from '../network/group';
import Snackbar from 'react-native-snackbar';

export default class GroupMemberBannedComponent extends React.Component {
    askUnbanMember() {
        Alert.alert(
            'Unban member',
            'Are you sure you want to unban ' + this.props.member.username + '?',
            [
                { text: 'Unban', onPress: () => this.unbanMember() },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: false }
        );
    }

    async unbanMember() {
        let response = await postUnbanUser(this.props.groupId, this.props.member.username, true);

        if (response !== false) {
            Snackbar.show({
                title: this.props.member.username + ' was unbanned',
                duration: Snackbar.LENGTH_LONG,
                action: {
                    title: 'CLOSE',
                    color: 'green',
                    onPress: () => Snackbar.dismiss(),
                }
            });
            // TODO refresh banned members of group
        }
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <Text>{this.props.member.firstname} {this.props.member.lastname}</Text>
                <Text style={{ flex: 1, marginLeft: 10 }}>({this.props.member.username})</Text>
                <Button title="Unban" onPress={() => this.askUnbanMember()} />
            </View>
        );
    }
}