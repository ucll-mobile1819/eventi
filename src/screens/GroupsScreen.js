import React from 'react';
import { View, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchGroups } from '../actions/GroupActions';
import { NavigationEvents } from 'react-navigation';

class GroupsScreen extends React.Component {
    onNavFocus() {
        this.props.fetchGroups();
    }

    render() {
        return (
            <View>
                <NavigationEvents onDidFocus={() => this.onNavFocus()} />
                { this.props.loading && <Text>Loading...</Text> }
                <Text>We have { this.props.groups.length } groups!</Text>
                <Button
                    title='Add group'
                    onPress={() =>
                    this.props.addGroup({})
                    }
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        groups: state.group.groups,
        loading: state.group.loading,
        error: state.group.error
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchGroups,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupsScreen);