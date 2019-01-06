import React from 'react';
import { Text, TouchableWithoutFeedback, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import headerStyles from '../styles/headerStyles';
import { Container, Tabs, Tab, Button, ActionSheet, View, Card, CardItem, Body, Footer, Left, Right, Grid, Col } from 'native-base';
import { fetchEvent ,fetchAtt, changeStatus} from '../actions/EventActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import IconMat from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import groupStyles from '../styles/groupStyles';
import { Table, TableWrapper, Row } from 'react-native-table-component';

const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

const red = '#DD1111';
const green = '#11DD52';
const grey = '#a8aeb7';


class EventScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showActivityIndicator: true,
            event: this.props.emptyEvent,
        };
    }
    static navigationOptions = obj => obj.navigation.state.params;

    onLoad() {
        
        this.props.fetchEvent(this.props.navigation.state.params.id)
            .then(this.props.fetchAtt(this.props.navigation.state.params.id))
            .then(() => {
                let attendances = this.props.status;
                let going = attendances.filter(el => el.status === 'Going').map(el => { firstname: el.firstname});
                let notGoing = attendances.filter(el => el.status === 'Not going').map(el => { firstname: el.firstname});
                
                console.log(going);
                console.log(notGoing);

                this.setState({
                    showActivityIndicator: false,
                    event: this.props.events.find(e => e.id === this.props.navigation.state.params.id)
                }, () => {
                    // Callback: when the state has been updated, we will update the header with the new event data
                    if (this.props.error) return;
                    this.props.navigation.setParams({
                        title: this.state.event.name,
                        customHeaderBackgroundColor: this.state.event.group.color,
                        headerTintColor: 'white', // Back arrow color
                        headerTitleStyle: { color: 'white' }, // Title color
                        headerRight: (
                            <View>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('EditEvent', { id: this.state.event.id })}>
                                    <MaterialIcon name='settings' {...headerStyles.iconProps} />
                                </TouchableWithoutFeedback>
                            </View>
                        )
                    });
                });
            });
            console.log(this.props.fetchAtt(this.props.navigation.state.params.id));
    }
    getGeustList(){

    }
    getDateDisplayFormat(date) {
        return date.getDate() + ' ' + months[date.getMonth()];
    }
    getTimeDisplayFormat(date) {
        let transformInt = num => {
            if (num.toString().length === 1) return '0' + num;
            return num;
        };
        if (date instanceof Date) {
            return transformInt(date.getHours()) + ':' + transformInt(date.getMinutes());
        } else {
            return "";
        }
    }
    notGoingToEvent(id){
        //Set event on not going
        this.props.changeStatus(id , "Not going");
        
    }

    goingToEvent(id){
        console.log(id);
        //Set event on going
        // if()
        this.props.changeStatus(id , "Going");
    }

    render() {
        
        let event = this.state.event;
        let time = "No date yet";
        if(event.startTime !== null){
            time= this.getDateDisplayFormat(event.startTime) +" "+ this.getTimeDisplayFormat(event.startTime) +" - "+ this.getDateDisplayFormat(event.endTime) +" "+ this.getTimeDisplayFormat(event.endTime);
        }

        return (
            <AuthenticatedComponent showActivityIndicator={() => this.state.showActivityIndicator}  navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                <Container>
                    <Tabs locked tabBarUnderlineStyle={{backgroundColor:'black'}}>
                    <Tab style={{backgroundColor: '#E9E9EF'}} tabStyle={{backgroundColor: "#EEEEEE"}} textStyle={{color:'black'}} activeTextStyle={{color:'black'}} activeTabStyle={{backgroundColor:'#EEEEEE'}} 
                    heading="Info">
                    <Container style={{backgroundColor: '#E9E9EF'}}>
                        <Card style={{ backgroundColor: "transparent",elevation: 0,borderColor:"transparent"}}>
                        <CardItem style={{ backgroundColor: "transparent",elevation: 0 ,borderColor:"transparent"}}>
                            <View>
                            <IconEvil name="location" size={30}/> 
                            </View>            
                            <View>
                                <Body>
                                    <Text>
                                        {event.address} {event.city} {event.country}
                                    </Text>
                                </Body>
                            </View>
                        </CardItem>
                        </Card>
                        <Card style={{ backgroundColor: "transparent",elevation: 0,borderColor:"transparent"}}>
                        <CardItem style={{ backgroundColor: "transparent",elevation: 0 ,borderColor:"transparent"}}>
                            <View>
                            <IconEvil name="calendar" size={30}/> 
                            </View>            
                            <View>
                                <Body>
                                    <Text>
                                        {time}
                                    </Text>
                                </Body>
                            </View>
                        </CardItem>
                        </Card>
                        </Container>
                    </Tab>
                    <Tab  style={{backgroundColor: '#E9E9EF'}} tabStyle={{backgroundColor: "#EEEEEE"}} textStyle={{color:'black'}} activeTextStyle={{color:'black'}} activeTabStyle={{backgroundColor:'#EEEEEE'}} 
                    heading="Geusts">
                        <Container style={{backgroundColor: '#E9E9EF'}}>
                        <Card style={{ backgroundColor: "transparent",elevation: 0,borderColor:"transparent"}}>
                        <CardItem style={{ backgroundColor: "transparent",elevation: 0 ,borderColor:"transparent"}}>
                            <View>
                            <IconEvil name="location" size={30}/> 
                            </View>            
                            <View>
                                <Body>
                                    <Text>
                                        
                                    </Text>
                                </Body>
                            </View>
                        </CardItem>
                        </Card>
                        </Container>
                    </Tab>
                    <Tab  style={{backgroundColor: '#E9E9EF'}} tabStyle={{backgroundColor: "#EEEEEE"}} textStyle={{color:'black'}} activeTextStyle={{color:'black'}} activeTabStyle={{backgroundColor:'#EEEEEE'}} 
                    heading="Comments">
                        <Text>3</Text>
                    </Tab>
                    </Tabs>
                   </Container>
                   <Footer  style={{backgroundColor:'#E9E9EF',borderBottomWidth: 0, shadowOffset: {height: 0, width: 0}, 
shadowOpacity: 0, elevation: 0}}>
                   <Grid>
                    <Col>
                   <TouchableWithoutFeedback onPress={() => this.goingToEvent(event.id)}>
                        <View style={{alignItems:"center"}}>
                            <Icon name="check" size={50} color={event.status == 'Going'? green : grey}/>
                        </View>
                    </TouchableWithoutFeedback>
                    </Col>
                    <Col>
                    <TouchableWithoutFeedback onPress={() => this.notGoingToEvent(event.id)}>
                        <View style={{alignItems:"center"}}>
                            <Icon name="close" size={50}  color={event.status == 'Not going'? red : grey}/>
                        </View>
                    </TouchableWithoutFeedback>
                    </Col>
                    </Grid>
                   </Footer>
            </AuthenticatedComponent>
        );
    }
}

 
// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
//     header: { height: 50, backgroundColor: '#537791' },
//     text: { textAlign: 'center', fontWeight: '100' },
//     dataWrapper: { marginTop: -1 },
//     row: { height: 40, backgroundColor: '#E7E6E1' }
//   });

  const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        height: 50
      },
  });

const mapStateToProps = state => {
    return {
        events: state.event.events,
        status: state.event.status,
        emptyEvent: state.event.emptyEvent,
        loading: state.group.loading,
        error: state.group.error
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({fetchEvent , fetchAtt, changeStatus}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen);