import React from 'react';
import { Text, View, TouchableWithoutFeedback, Alert } from 'react-native';
import groupStyles from '../styles/groupStyles';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

export default class GroupComponent extends React.Component {
    // TODO? show amount of members in group
    render() {
        return (
            <View style={groupStyles.container}>
                <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.push('Group', {
                        id: this.props.group.id,
                        memberCount: this.props.group.memberCount  // pass memberCount to not have to fetch it a second time
                    })}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <View style={[groupStyles.overviewColor, { backgroundColor: this.props.group.color }]} />
                        <View style={{ padding: 10, flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={groupStyles.title}>{this.props.group.name}</Text>
                                <Text>{this.shorten(this.props.group.description, 50)}</Text>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
                                <FontAwesomeIcon name='group' size={25} color='black' />
                                <Text style={{ fontSize: 15 }}>{this.props.group.memberCount}</Text>
                            </View>
                        </View>
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