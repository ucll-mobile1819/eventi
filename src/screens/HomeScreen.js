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
// import { array } from '../../../../../Library/Caches/typescript/3.2/node_modules/@types/prop-types';
var all = [];
var going = [];
var mine = [];
class HomeScreen extends React.Component{
    constructor(props){
        super(props);
        this.createGoing = this.createGoing.bind(this);
    }
    onLoad() {
        this.props.fetchEvents();
    }
    
    createGoing(){
        all.forEach(element => {
            if(element.status == "Going"){
                going.push(element);
            }
            
        });
        console.table(going);
    }
    createMine(){
        //Implement after merge 
        all.forEach(element => {
            //hardcoded
            if(element.creator.username === "john" ){
                mine.push(element);
            }
        });
    }
    start(){
        all = this.props.events;
        all.forEach(element => {
            if(element.startTime != null){
                var date = new Date(element.startTime);
                element.startTime = date.getDate() + "/" + date.getMonth();
            }
        });
    }
    // constructor(props){super(props)}
    render(){
        return(
            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
            <Container>
            { this.props.loading && <Text>Loading...</Text> }
            {this.start()}
            {this.createGoing()}
            {this.createMine()}
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
                    data={going}
                    renderItem={({item}) => 
                    <MyCard date={ item.startTime || "" } title={item.name} color={item.group.color} buttons="true" />
                    }
                    />
                </Tab>
                <Tab heading="Mine">
                    <FlatList
                    data={mine}
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