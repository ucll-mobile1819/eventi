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
                        name: this.props.group.name,
                        color: this.props.group.color // also pass color to have right color instead of color of last group
                    })}
                >
                    <View>
                        <Text style={groupStyles.title}>{this.props.group.name}</Text>
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
}