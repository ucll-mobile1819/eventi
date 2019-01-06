import React from 'react';
import { ScrollView } from 'react-native';
import { Text, TouchableWithoutFeedback, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import headerStyles from '../styles/headerStyles';
import { Container, Tabs, Tab , Button, ActionSheet, View} from 'native-base';
import { fetchEvent } from '../actions/EventActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import groupStyles from '../styles/groupStyles';
import { Table, TableWrapper, Row } from 'react-native-table-component';

const red = '#DD1111';
const green = '#11DD52';
const grey = '#a8aeb7';

class EventScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Head', 'Head2', 'Head3', 'Head4', 'Head5', 'Head6', 'Head7', 'Head8', 'Head9'],
            widthArr: [40, 60, 80, 100, 120, 140, 160, 180, 200],
            showActivityIndicator: true,
            event: this.props.emptyEvent,
        };
    }
    static navigationOptions = obj => obj.navigation.state.params;

    onLoad() {
        // this.props.fetchEvent(this.props.navigation.state.params.id)
        // .then(() => {
        //     console.log("Name Event");
        //     console.log(this.props.event.name);
        //     this.setState({ showActivityIndicator: false });
        //     }
        // );
        
        this.props.fetchEvent(this.props.navigation.state.params.id)
            .then(() => {
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
    }

    render() {
        const state = this.state;
        const tableData = [];
        for (let i = 0; i < 30; i += 1) {
            const rowData = [];
            for (let j = 0; j < 9; j += 1) {
                rowData.push(`${i}${j}`);
            }
            tableData.push(rowData);
        }

        let event = this.state.event;
        return (
            <AuthenticatedComponent showActivityIndicator={() => this.state.showActivityIndicator}  navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                <Container>
                    <Tabs locked tabBarUnderlineStyle={{backgroundColor:'black'}}>
                    <Tab tabStyle={{backgroundColor: "#EEEEEE"}} textStyle={{color:'black'}} activeTextStyle={{color:'black'}} activeTabStyle={{backgroundColor:'#EEEEEE'}} 
                    heading="Info">
                        <Container style={groupStyles.container}>
                            <Text>{event.name}</Text>
                            <Text>11 Nov 18:30 - 11 Nov 23:30</Text>
                            <ScrollView horizontal={true}>
                                <View>
                                    <Table borderStyle={{borderColor: '#C1C0B9'}}>
                                        <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.text}/>
                                    </Table>
                                    <ScrollView style={styles.dataWrapper}>
                                        <Table borderStyle={{borderColor: '#C1C0B9'}}>
                                        {
                                            tableData.map((rowData, index) => (
                                            <Row
                                            key={index}
                                            data={rowData}
                                            widthArr={state.widthArr}
                                            style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                                            textStyle={styles.text}
                                            />
                                            ))
                                        }
                                        </Table>
                                    </ScrollView>
                                </View>
                            </ScrollView>
                        </Container>
                    </Tab>
                    <Tab tabStyle={{backgroundColor: "#EEEEEE"}} textStyle={{color:'black'}} activeTextStyle={{color:'black'}} activeTabStyle={{backgroundColor:'#EEEEEE'}} 
                    heading="Geusts">
                        <Text>2</Text>
                    </Tab>
                    <Tab tabStyle={{backgroundColor: "#EEEEEE"}} textStyle={{color:'black'}} activeTextStyle={{color:'black'}} activeTabStyle={{backgroundColor:'#EEEEEE'}} 
                    heading="Comments">
                        <Text>3</Text>
                    </Tab>
                    </Tabs>
                    <TouchableWithoutFeedback  onPress={() => this.notGoingToEvent()}>
                        <View>
                            <Icon name="close" size={30} />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback  onPress={() => this.notGoingToEvent()}>
                        <View>
                            <Icon name="close" size={30}  />
                        </View>
                    </TouchableWithoutFeedback>
                   </Container>
            </AuthenticatedComponent>
        );
    }
}

 
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    header: { height: 50, backgroundColor: '#537791' },
    text: { textAlign: 'center', fontWeight: '100' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E7E6E1' }
  });

const mapStateToProps = state => {
    return {
        events: state.event.events,
        emptyEvent: state.event.emptyEvent,
        loading: state.group.loading,
        error: state.group.error
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({fetchEvent}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen);