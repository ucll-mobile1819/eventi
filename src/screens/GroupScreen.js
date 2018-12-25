import React from 'react';
import { Text, Button, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import headerStyles from '../styles/headerStyles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { fetchGroup } from '../actions/GroupActions';

class GroupScreen extends React.Component {
    static navigationOptions = obj => obj.navigation.state.params;

    onLoad() {
        this.props.fetchGroup(this.props.navigation.state.params.id)
        .then(() => {
            this.props.navigation.setParams({
                title: this.props.group.name,
                customHeaderBackgroundColor: this.props.group.color,
                headerTintColor: 'white', // Back arrow color
                headerTitleStyle: { color: 'white' }, // Title color
                headerRight: (
                    <TouchableWithoutFeedback onPress={() => this.props.navigation.push('GroupSettings', { id: this.props.group.id })}>
                        <MaterialIcon name='settings' {...headerStyles.iconProps} />
                    </TouchableWithoutFeedback>
                )
            });
        });
    }

    render() {
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                {this.props.loading && <Text>Loading group...</Text>}
                <Text style={{fontSize: 30, fontWeight: 'bold', color: 'black'}}>{this.props.group.name}</Text>
                <Text>{this.getMemberCountString(this.props.navigation.state.params.memberCount)}</Text>
                <Text>{this.props.group.description}</Text>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>Events</Text>
                <Button onPress={() => this.props.navigation.push('Event', { id: 3 })} title='Dummy event (id: 3)' />
                <Button onPress={() => this.props.navigation.push('Event', { id: 5 })} title='Dummy event (id: 5)' />
            </AuthenticatedComponent>
        );
    }

    getMemberCountString(memberCount) {
        if (memberCount === 1) {
            return "1 member";
        }
        return membercount + " members";
    };
}

const mapStateToProps = state => {
    return {
        group: state.group.group,
        loading: state.group.loading,
        error: state.group.error
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchGroup
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupScreen);