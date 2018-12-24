import React from 'react';
import { Text, Button, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchGroups } from '../actions/GroupActions';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import GroupComponent from '../components/GroupComponent';

class GroupsScreen extends React.Component {
    onLoad() {
        this.props.fetchGroups();
    }

    render() {
        console.log(this.props.groups[0]);
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                {this.props.loading && <Text>Loading...</Text>}
                <Text>You have {this.props.groups.length} groups!</Text>
                <FlatList
                    data={this.props.groups}
                    renderItem={group => <Text>Groep</Text>}
                    keyExtractor={(item, index) => String(item.id)}
                />
                <Button onPress={() => this.props.navigation.push('CreateGroup')} title='Create Group' />
            </AuthenticatedComponent>
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