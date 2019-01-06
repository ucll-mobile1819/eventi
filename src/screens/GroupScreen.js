import React from 'react';
import { Text, Button, TouchableWithoutFeedback, Alert, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import headerStyles from '../styles/headerStyles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { fetchGroup } from '../actions/GroupActions';
import groupStyles from '../styles/groupStyles';

class GroupScreen extends React.Component {
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
        this.props.fetchGroup(this.props.navigation.state.params.id)
            .then(() => {
                this.updateState({ showActivityIndicator: false });
                if (this.props.error) return;
                this.props.navigation.setParams({
                    title: this.props.group.name,
                    customHeaderBackgroundColor: this.props.group.color,
                    headerTintColor: 'white', // Back arrow color
                    headerTitleStyle: { color: 'white' }, // Title color
                    headerRight: (
                        <View>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('GroupSettings', { id: this.props.group.id })}>
                                <MaterialIcon name='settings' {...headerStyles.iconProps} />
                            </TouchableWithoutFeedback>
                        </View>
                    )
                });
            });
    }

    render() {
        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} showActivityIndicator={() => this.state.showActivityIndicator} navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                <View style={{ padding: 10 }}>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'lightgrey', paddingBottom: 20, marginBottom: 20 }}>
                        <Text style={{ flex: 1 }}>{this.props.group.description || "No description was provided for this group."}</Text>
                        <View style={groupStyles.memberCountContainer}>
                            <FontAwesomeIcon name='group' size={25} color='grey' />
                            <Text style={[groupStyles.memberCount, { color: 'grey'}]}>{this.props.group.memberCount}</Text>
                        </View>
                    </View>
                    <Text style={[groupStyles.subtitle, {marginBottom: 10 }]}>Events</Text>
                    {/* TODO: add events here */}
                    {/* <Button onPress={() => this.props.navigation.push('Event', { id: 3 })} title='Dummy event (id: 3)' /> */}
                    <Text>No events here yet...</Text>
                </View>
            </AuthenticatedComponent>
        );
    }
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