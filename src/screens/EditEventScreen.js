import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

class EditEventScreen extends React.Component {

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    onLoad() {

    }

    render() {
        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                
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