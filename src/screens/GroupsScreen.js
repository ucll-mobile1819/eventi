import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchGroups } from '../actions/GroupActions';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

class GroupsScreen extends React.Component {
    onLoad() {
        this.props.fetchGroups();
    }

    render() {
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                { this.props.loading && <Text>Loading...</Text> }
                <Text>We have { this.props.groups.length } groups!</Text>
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