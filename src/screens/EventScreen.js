import React from 'react';
import { Text, TouchableWithoutFeedback, StyleSheet, ActivityIndicator, SectionList, TextInput, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import headerStyles from '../styles/headerStyles';
import { Container, Tabs, Tab, Button, ActionSheet, View, Card, CardItem, Body, Footer, Left, Right, Grid, Col, Content, Item, Input } from 'native-base';
import { fetchEvent ,fetchAtt, changeStatus , fetchComments , postComment} from '../actions/EventActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import Balloon from "react-native-balloon";
import IconEvil from 'react-native-vector-icons/EvilIcons';
import PollTableComponent from "../components/PollTableComponent"
import IconMat from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import groupStyles from '../styles/groupStyles';
import { Table, TableWrapper, Row } from 'react-native-table-component';
const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

const red = '#DD1111';
const green = '#11DD52';
const grey = '#a8aeb7';

let going = [];
let notGoing = [];

class EventScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            showActivityIndicator: true,
            event: this.props.emptyEvent,
            groupData: [],
            pollDates:[],
            sendingMessage:false
        };
    }
    static navigationOptions = obj => obj.navigation.state.params;

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    onLoad() {
        //Make this
        this.props.fetchEvent(this.props.navigation.state.params.id)
            .then(() => this.props.fetchAtt(this.props.navigation.state.params.id))
                .then(() => this.props.fetchComments(this.props.navigation.state.params.id))
                    .then(() => {
                    this.updateState({
                        showActivityIndicator: false,
                        groupData: [],
                        event: this.props.events.find(e => e.id === this.props.navigation.state.params.id)
                    }, () => {

                    console.log(this.state.event.pollDates);
                    this.setGeusts();
                    if (this.props.error) return;
                    console.log(this.props.comments);
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
    }
    componentDidMount() {
        this.interval = setInterval(() => this.updateState({ setComments: this.setComments() }), 1000);
      }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    setComments(){
        this.props.fetchComments(this.props.navigation.state.params.id)
        .then(()=>{
        let comments = this.props.comments;
        let commentList;
        
        commentList = comments.map(el =>{ 
            let who = el.creator.username === this.props.user.username ? "me":"they" ;
            return {key: el.id, who: who,what: el.content ,name: this.props.user.username} 
        })
        
        let commentsJSX = commentList.map(el =>{
            if(el.who === "me"){
               return(
                
                <Balloon
                key={el.key}
                borderColor="transparent"
                backgroundColor="#007FF7"
                borderWidth={2}
                borderRadius={20}
                triangleSize={1}
                >
                <Text style={{color:'white'}}>{el.what}</Text>
                </Balloon>
               );
            }else{
               return(
                <View 
                key={el.key}>
                <Text style={{marginLeft:10, fontSize:12}}>{el.name}</Text>
                <Balloon
                borderColor="transparent"
                backgroundColor="white"
                borderWidth={2}
                borderRadius={20}
                triangleSize={1}
                >
                <Text style={{color:'black'}}>{el.what}</Text>
                </Balloon>
                </View>
               );
            }
        })
        this.updateState({
            myComments: commentsJSX,
            })
        })
        
    }
    async setGeusts(){
        let attendances = this.props.status;
        going = attendances.filter(el => el.status === 'Going').map(el => {return {firstname: el.user.firstname, lastname: el.user.lastname }});
        notGoing = attendances.filter(el => el.status === 'Not going').map(el => {return {firstname: el.user.firstname, lastname: el.user.lastname }});
        console.log(going);
        console.log(notGoing);
        going = going.map(el => {return(el.firstname+" "+el.lastname)});
        notGoing = notGoing.map(el => {return(el.firstname+" "+el.lastname)});
        this.updateState({
            showActivityIndicator: false,
            groupData: going,
            event: this.props.events.find(e => e.id === this.props.navigation.state.params.id)
        })
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
        this.props.changeStatus(id , "Not going")
        .then(() => {
            this.props.fetchAtt(id)
            .then(()=> this.setGeusts())
        })
        
    }

    goingToEvent(id){
        console.log(id);
        //Set event on going
        // if()
        // this.props.changeStatus(id , "Going")
        this.props.changeStatus(id , "Going")
        .then(() => {
            this.props.fetchAtt(id)
            .then(()=> this.setGeusts())
        })
    }
    sendMessage(){
        if(!this.state.sendingMessage){
        this.updateState({sendingMessage: true});
        let content = this.state.text.trim().length === 0 ? null : this.state.text ; 
        if(content !== null){
            this.props.postComment(this.props.navigation.state.params.id , content)
            .then(() =>{
                this.updateState({text: ''});
                console.log(this.state.text);

            })
        }
        this.updateState({sendingMessage: false});
        }   
    }
    renderFooter(event){
        if(event.type !=="poll"){
        return(
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
        );
        }
    }
    renderTable(event){
        console.log(event);
        if(event.type ==="poll"){
            let pollDates = event.pollDates.map(el =>{return {id: el.id,startTime:el.startTime,endTime:el.endTime}});
            let pollDateVotes = event.pollDates.map(el =>el.id);
            console.log("pollDateVotes start");
            console.log(pollDateVotes);
            console.log("pollDateVotes end");
        return(
            <PollTableComponent 
            selectable={true}
            mode="overview" 
            showAmountOfVotes={true} 
            pollDateFixed={false}
            pollDateVotes={pollDateVotes} 
            pollDates={pollDates}>
            
            </PollTableComponent>
        )}
    }
    render() {
        
        let event = this.state.event;
        let time = "No date yet";
        if(event.startTime !== null){
            time= this.getDateDisplayFormat(event.startTime) +" "+ this.getTimeDisplayFormat(event.startTime) +" - "+ this.getDateDisplayFormat(event.endTime) +" "+ this.getTimeDisplayFormat(event.endTime);
        }

        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} showActivityIndicator={() => this.state.showActivityIndicator} navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
            
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
                        
                        
                        {this.renderTable(event)}
                        
                        </Container>
                    {this.renderFooter(event)}
                    </Tab>
                    <Tab  style={{backgroundColor: '#E9E9EF'}} tabStyle={{backgroundColor: "#EEEEEE"}} textStyle={{color:'black'}} activeTextStyle={{color:'black'}} activeTabStyle={{backgroundColor:'#EEEEEE'}} 
                    heading="Geusts">
                        <Container style={{backgroundColor: '#E9E9EF'}}>
                        <SectionList
                            renderItem={({item, index, section}) => <Text style={{margin: 8,fontSize: 15}} key={index}>{item}</Text>}
                            renderSectionHeader={({section: {title}}) => (
                                <Text style={{fontWeight: 'bold',margin: 8,fontSize: 25}}>{title}</Text>
                            )}
                            sections={[
                                {title: 'Going', data: this.state.groupData},
                                {title: 'Not going', data: notGoing},
                            ]}
                            keyExtractor={(item, index) => item + index}
                        />
                        </Container>
                    </Tab>
                    <Tab  style={{backgroundColor: '#E9E9EF'}} tabStyle={{backgroundColor: "#EEEEEE"}} textStyle={{color:'black'}} activeTextStyle={{color:'black'}} activeTabStyle={{backgroundColor:'#EEEEEE'}} 
                    heading="Comments">
                    <ScrollView 
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight)=>{        
                        this.scrollView.scrollToEnd({animated: true});
                    }}>
                    
                    <Right>
                    {this.state.myComments}
                    </Right>
                    
                    <Item style={{backgroundColor:'#FFF'}} rounded>
                        <Input value={this.state.text} onChangeText={(text) => this.updateState({text})} style={{paddingTop: 0,paddingBottom: 0}} placeholder='Write your message!' />
                        <TouchableWithoutFeedback onPress={this.sendMessage.bind(this)}>
                        <Icon name='send-o' size={20} style={{marginRight:10}}/>
                        </TouchableWithoutFeedback>
                    </Item>
                    </ScrollView>
                    </Tab>
                    </Tabs>
                   </Container>
                   
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
      me:{
        backgroundColor:'grey',maxHeight:30
      },
      they:{
        backgroundColor:'green',maxHeight:30
      }
  });

const mapStateToProps = state => {
    return {
        events: state.event.events,
        status: state.event.status,
        comments: state.event.comments,
        emptyEvent: state.event.emptyEvent,
        loading: state.group.loading,
        user: state.user.user,
        error: state.group.error
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({fetchEvent , fetchAtt, changeStatus, fetchComments, postComment}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen);