import React from 'react';
import { Container, Tab, Tabs, Button, Text,Spinner, Toast, Root} from 'native-base';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import { fetchEvents } from '../actions/EventActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EventComponent from '../components/EventComponent';
import { FlatList } from 'react-native-gesture-handler';
import { color } from 'color';

class HomeScreen extends React.Component{
    constructor(props){
        super(props);
        // TODO: remove hard coded value & add user redux state implementation by merging with master-react-native so you can use this.props.user.user.username
        this.username = this.props.user.username;
        this.state = {
            showToast: false
      };
    }

    onLoad() {
        console.log("------------- ONLOAD HOMESCREEN -------------")
        this.props.fetchEvents();
    }
    sortEventsByDate(events) {
        return events.sort((a, b) => {
            if (!(a.startTime instanceof Date) && !(b.startTime instanceof Date)) return a.id - b.id;
            if (!(a.startTime instanceof Date)) return -1;
            if (!(b.startTime instanceof Date)) return 1;
            return a.startTime.getTime() - b.startTime.getTime();
        });
    }
    
    render(){
        const renderItem = ({item}) => <EventComponent event={item} nav={this.props.navigation}/>;
        let events = this.sortEventsByDate(this.props.events);
        // let events = this.props.events;
        return(
            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
            {/* TODO: Add activity loader */}

                <Container>
                    <Tabs>
                        <Tab heading="All events">
                        <FlatList
                        data={events}
                        renderItem={renderItem}
                        />
                        </Tab>
                        <Tab heading="Going">
                        
                            <FlatList
                            data={events.filter(event => event.status === 'Going')}
                            renderItem={renderItem}
                            />
                        </Tab>
                        <Tab heading="My events">
                            <FlatList
                            data={events.filter(event => event.creator.username === this.username)}
                            renderItem={renderItem}
                            />
                        </Tab>
                    </Tabs>
                    </Container>
            </AuthenticatedComponent>
        )
    }
}
const mapStateToProps = state => {
    return {
        events: state.event.events,
        user: state.user.user,
        loading: state.event.loading,
        error: state.event.error
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchEvents,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);