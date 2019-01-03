import React from 'react';
import { Container, Header, Tab, Tabs, ScrollableTab, Text ,Button} from 'native-base';
import Going  from '../components/Tabs/Going';
import NotGoing from '../components/Tabs/NotGoing';
import History from '../components/Tabs/History';
import CreatedByMe from '../components/Tabs/CreatedByMe';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import { fetchEvents } from '../actions/EventActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MyCard } from '../components/MyCard';
import { FlatList } from 'react-native-gesture-handler';

class HomeScreen extends React.Component{
    constructor(props){
        super(props);
        // TODO: remove hard coded value & add user redux state implementation by merging with master-react-native so you can use this.props.user.user.username
        this.username = 'bob';
    }

    onLoad() {
        this.props.fetchEvents();
    }
    
    render(){
        return(
            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
            {/* TODO: Add activity loader */}
            <Container>
            <Tabs>
                <Tab heading="All">
                <FlatList
                data={this.props.events}
                renderItem={({item}) => 
                   <MyCard date={ item.startTime || "" } title={item.name} color={item.group.color} buttons="true" />
                }
                />
                </Tab>
                <Tab heading="Going">
                    <FlatList
                    data={this.props.events.filter(event => event.status === 'Going')}
                    renderItem={({item}) => 
                    <MyCard date={ item.startTime || "" } title={item.name} color={item.group.color} buttons="true" />
                    }
                    />
                </Tab>
                <Tab heading="Mine">
                    <FlatList
                    data={this.props.events.filter(event => event.creator.username === this.username)}
                    renderItem={({item}) => 
                    <MyCard date={ item.startTime || "" } title={item.name} color={item.group.color} buttons="true" />
                    }
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