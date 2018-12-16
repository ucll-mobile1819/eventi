import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

class EditEventScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.id.toString(),
        customHeaderBackgroundColor: '#f44242',
        headerTintColor: 'white', // Back arrow color
        headerTitleStyle: { color: 'white' }, // Title color
    });

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