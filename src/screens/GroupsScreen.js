import React from 'react';
import { Text, Button, FlatList, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchGroups } from '../actions/GroupActions';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import GroupComponent from '../components/GroupComponent';

class GroupsScreen extends React.Component {
    static navigationOptions = obj => obj.navigation.state.params;

    constructor(props) {
        super(props);
        this.state = {
            showActivityIndicator: true
        };
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    onLoad() {
        this.props.fetchGroups()
        .then(() => this.updateState({ showActivityIndicator: false }));

        this.props.navigation.setParams({
            headerRight: (
                    <TouchableWithoutFeedback onPress={() => this.props.navigation.push('CreateGroup')}>
                        <Text 
                        style={{
                            color: 'white',
                            marginRight: 15,
                            fontSize: 34,
                        }}
                        >+</Text>
                    </TouchableWithoutFeedback>
            )
        });
    }

    render() {
        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} showActivityIndicator={() => this.state.showActivityIndicator} navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                <FlatList
                    data={this.props.groups}
                    renderItem={({item}) => <GroupComponent group={item} navigation={this.props.navigation} />}
                    keyExtractor={(group, index) => String(group.id)}
                />
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