import React from 'react';
import { Text, Button, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import headerStyles from '../styles/headerStyles';

class EventScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.id.toString(),
        customHeaderBackgroundColor: '#f44242',
        headerTintColor: 'white', // Back arrow color
        headerTitleStyle: { color: 'white' }, // Title color
        headerRight: (
            <TouchableWithoutFeedback  onPress={() => navigation.push('EditEvent', { id: navigation.state.params.id })}>
                <MaterialIcon name='settings' {...headerStyles.iconProps} />
            </TouchableWithoutFeedback>
        )
    });

    render() {
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad}>
                <Text>EventScreen</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen);