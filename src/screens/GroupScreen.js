import React from 'react';
import { Text, Button, TouchableWithoutFeedback, Alert, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import headerStyles from '../styles/headerStyles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { fetchGroup } from '../actions/GroupActions';
import {fetchEvents} from '../actions/EventActions';
import groupStyles from '../styles/groupStyles';
import EventComponent from '../components/EventComponent';
import { FlatList } from 'react-native-gesture-handler';
import { fetchGroups } from '../actions/GroupActions';
class GroupScreen extends React.Component {
    static navigationOptions = obj => obj.navigation.state.params;

    constructor(props) {
        super(props);
        this.state = {
            showActivityIndicator: true,
            color: '',
        };
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    onLoad() {
        Promise.all([
            this.props.fetchGroup(this.props.navigation.state.params.id),
            this.props.fetchEvents(),
            this.props.fetchGroups()
        ])
            .then(() => {
                this.updateState({ showActivityIndicator: false }); 
                if (this.props.error) return;
                this.updateHeader()
            });
    }

    updateHeader() {
        setTimeout(() => {
            this.updateState({ color: this.props.group.color });
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
        }, 1);
    }

    sortEventsByDate(events) {
        return events.sort((a, b) => {
            if (!(a.startTime instanceof Date) && !(b.startTime instanceof Date)) return a.id - b.id;
            if (!(a.startTime instanceof Date)) return -1;
            if (!(b.startTime instanceof Date)) return 1;
            return a.startTime.getTime() - b.startTime.getTime();
        });
    }
    
    render() {
        const renderItem = ({item}) => <EventComponent event={item} nav={this.props.navigation}/>;
        if (!this.props.error && this.state.color !== this.props.group.color) this.updateHeader();
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
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                    data={this.sortEventsByDate(this.props.events).filter(event => event.group.id === this.props.group.id)}
                    renderItem={renderItem}
                    />
                </View>
            </AuthenticatedComponent>
        );
    }
}

const mapStateToProps = state => {
    return {
        group: state.group.group,
        events: state.event.events,
        loading: state.group.loading,
        error: state.group.error
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchGroup,fetchEvents,fetchGroups
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupScreen);