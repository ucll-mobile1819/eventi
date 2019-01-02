import React from 'react';
import { Container, Header, Tab, Tabs, ScrollableTab, Text } from 'native-base';
import Going  from '../components/Tabs/Going';
import NotGoing from '../components/Tabs/NotGoing';
import History from '../components/Tabs/History';
import CreatedByMe from '../components/Tabs/CreatedByMe';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import { fetchEvents } from '../actions/EventActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
class HomeScreen extends React.Component{
    onLoad() {
        this.props.fetchEvents();
    }
    // constructor(props){super(props)}
    render(){
        return(
            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>  
            
            <Tabs>
                <Tab heading="Going">
                    <Going />
                </Tab>
                <Tab heading="Not Going">
                    <NotGoing />
                </Tab>
                <Tab heading="History">
                    <History />
                </Tab>
                <Tab heading="Created">
                    <CreatedByMe />
                </Tab>
            </Tabs>
            { this.props.loading && <Text>Loading...</Text> }
            
            </AuthenticatedComponent>
        );
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