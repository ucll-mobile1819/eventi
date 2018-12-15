import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

class EditEventScreen extends React.Component {
    render() {
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad}>
                <Text>EditEventScreen</Text>
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