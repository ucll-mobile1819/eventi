import React from 'react';
import { Text, View, Button, Alert } from 'react-native';


export default class GroupMemberComponent extends React.Component {
    askBanMember() {
        Alert.alert(
            'Ban member',
            'Are you sure that you want to ban this user?',
            [
                { text: 'Delete', onPress: () => this.banMember() },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: false }
        );
    }

    banMember() {
        Alert.alert("BANHAMMER");
    }

    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text>{this.props.member.username}</Text>
                <Text>({this.props.member.firstname} {this.props.member.lastname})</Text>
                <Button title="Ban" onPress={() => this.askBanMember()} />
            </View>
        );
    }
}