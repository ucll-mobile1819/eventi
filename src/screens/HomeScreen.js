import React from 'react';
import { Container, Tab, Tabs, Button, Text,Spinner} from 'native-base';
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
        console.log("CURRENT USER: "+ this.props.user.username);
    }

    onLoad() {
        console.log("------------- ONLOAD HOMESCREEN -------------")
        this.props.fetchEvents();
    }

    sortEventsByDate(events) {
        return events.sort((a, b) => {
            if (!(a.startTime instanceof Date)) return -1;
            if (!(b.startTime instanceof Date)) return 1;
            return a.startTime.getTime() - b.startTime.getTime();
        });
    }
    
    render(){
        const renderItem = ({item}) => <EventComponent event={item} nav={this.props.navigation}/>;
        let events = this.sortEventsByDate(this.props.events);
        return(

            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
            {/* TODO: Add activity loader */}

            {this.props.loading && <Spinner color='blue' />}
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
                    <Button onPress={() => this.props.navigation.navigate('Event',{})}><Text>Click me</Text></Button>
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