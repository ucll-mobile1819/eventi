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
            showActivityIndicator: true,
            back: false,
        };
    }

    onLoad() {
        this.props.fetchGroups()
        .then(() => this.setState({ showActivityIndicator: false }));

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

    isBack() {
        setTimeout(() => this.setState({ back: false }), 1);
        return this.state.back;
    }

    render() {
        return (
            <AuthenticatedComponent isBack={() => this.isBack()} showActivityIndicator={() => this.state.showActivityIndicator} navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                <FlatList
                    data={this.props.groups}
                    renderItem={({item}) => <GroupComponent onBack={() => this.setState({ back: true })} group={item} navigation={this.props.navigation} />}
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