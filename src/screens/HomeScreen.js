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
        this.username = this.props.user.username;
        this.state = {
            showActivityIndicator: true
          };
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    onLoad() {
        this.props.fetchEvents()
        .then(() => this.updateState({ showActivityIndicator: false }));
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
        return(
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} showActivityIndicator={() => this.state.showActivityIndicator}  navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                <Container>
                    <Tabs>
                        <Tab textStyle={{color: 'white'}} style={{backgroundColor: '#E9E9EF'}} heading="All events">
                        <FlatList
                        data={events}
                        renderItem={renderItem}
                        />
                        </Tab>
                        <Tab textStyle={{color: 'white'}} style={{backgroundColor: '#E9E9EF'}} heading="Going">
                        
                            <FlatList
                            data={events.filter(event => event.status === 'Going')}
                            renderItem={renderItem}
                            />
                        </Tab>
                        <Tab textStyle={{color: 'white'}} style={{backgroundColor: '#E9E9EF'}} heading="My events">
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
