import React from 'react';
import { Text, View, TouchableWithoutFeedback, Alert } from 'react-native';
import groupStyles from '../styles/groupStyles';

export default class GroupComponent extends React.Component {
    // TODO? show amount of members in group
    render() {
        return (
            <View style={[groupStyles.container, { backgroundColor: this.props.group.color }]}>
                <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.push('Group', {
                        id: this.props.group.id,
                        name: this.props.group.name,  // possibly needed for changing navigation header with name
                        color: this.props.group.color, // also pass color to have right color immediately instead of color of last group
                        memberCount: this.props.group.memberCount  // pass memberCount to not have to fetch it a second time
                    })}
                >
                    <View>
                        <Text style={groupStyles.title}>{this.props.group.name}</Text>
                        <Text>{this.getMemberCountString(this.props.group.memberCount)}</Text>
                        <Text style={groupStyles.description}>{this.shorten(this.props.group.description, 50)}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    shorten(string, maxLength) {
        if (string.length > maxLength) {
            return string.substring(0, maxLength - 1) + '...';
        }
        else {
            return string;
        }
    }

    getMemberCountString(memberCount) {
        if (memberCount === 1) {
            return "1 member";
        }
        return membercount + " members";
    }
}