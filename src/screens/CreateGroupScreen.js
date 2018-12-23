import React from 'react';
import { TextInput, Button } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import { customStyles } from '../styles/customStyles';
import { createGroup } from '../actions/GroupActions';

class CreateGroupScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupname: '',
            description: '',
            color: ''
        };
    }

    async createGroup() {
        let response = await createGroup(this.state.groupname, this.state.description, this.state.color);
        //if (!response) return;
        this.props.navigation.push('Groups');
    }

    render() {
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate}>
                <TextInput
                    style={customStyles.inputField}
                    placeholder="Group name"
                    value={this.state.groupname}
                    onChangeText={groupname => this.setState({ groupname })}
                />
                <TextInput
                    style={customStyles.inputField}
                    placeholder="Description"
                    value={this.state.description}
                    onChangeText={description => this.setState({ description })}
                />
                <TextInput
                    style={customStyles.inputField}
                    placeholder="Color"
                    value={this.state.color}
                    onChangeText={color => this.setState({ color })}
                />
                <Button
                    title="Create group"
                    onPress={() => this.createGroup()}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupScreen);