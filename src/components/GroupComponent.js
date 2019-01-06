import React from 'react';
import { Text, View, TouchableWithoutFeedback, Alert } from 'react-native';
import groupStyles from '../styles/groupStyles';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

export default class GroupComponent extends React.Component {
    render() {
        return (
            <View style={groupStyles.container}>
                <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.push('Group', {
                        id: this.props.group.id,
                        onBack: this.props.onBack
                    })}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <View style={[groupStyles.overviewColor, { backgroundColor: this.props.group.color }]} />
                        <View style={{ padding: 10, flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={groupStyles.title}>{this.props.group.name}</Text>
                                <Text numberOfLines={1}>{this.props.group.description}</Text>
                            </View>
                            <View style={groupStyles.memberCountContainer}>
                                <FontAwesomeIcon name='group' size={25} color='lightgrey' />
                                <Text style={groupStyles.memberCount}>{this.props.group.memberCount}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}