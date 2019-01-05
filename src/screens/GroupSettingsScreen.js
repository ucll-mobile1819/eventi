import React from 'react';
import { Text, Button } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import { fetchGroup } from '../actions/GroupActions';

class GroupSettingsScreen extends React.Component {
    static navigationOptions = obj => obj.navigation.state.params;

    constructor(props) {
        super(props);
        this.state = {
            showActivityIndicator: true
        };
    }

    onLoad() {
        this.props.fetchGroup(this.props.navigation.state.params.id)
        .then(() => {
            this.setState({ showActivityIndicator: false });
            if (this.props.error) return;
            this.props.navigation.setParams({
                // title: this.props.navigation.state.params.id.toString(),
                title: 'Settings',
                customHeaderBackgroundColor: this.props.group.color,
                headerTintColor: 'white', // Back arrow color
                headerTitleStyle: { color: 'white' }, // Title color
            });
        });
    }

    render() {
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                <Text>GroupSettingsScreen</Text>
            </AuthenticatedComponent>
        );
    }
}

const mapStateToProps = state => {
    return {
        group: state.group.group,
        error: state.group.error
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchGroup
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupSettingsScreen);