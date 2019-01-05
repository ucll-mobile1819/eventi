import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

var event;
class EditEventScreen extends React.Component {
    static navigationOptions = obj => obj.navigation.state.params;

    onLoad() {
        event = this.props.navigation.getParam("event","No event"); 
        this.props.navigation.setParams({
            title: "Title does not work",
            customHeaderBackgroundColor: 'red',
            headerTintColor: 'white', // Back arrow color
            headerTitleStyle: { color: 'white' }, // Title color
        });
    }

    render() {
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                
            </AuthenticatedComponent>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EditEventScreen);