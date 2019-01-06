import React from 'react';
import { Text, TouchableWithoutFeedback ,StyleSheet} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import headerStyles from '../styles/headerStyles';
import { Container, Tabs, Tab , Button, ActionSheet} from 'native-base';
import { Header } from 'react-navigation';
import { color } from 'color';

var BUTTONS = ["Option 0", "Option 1", "Option 2", "Delete", "Cancel"];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

class EventScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static navigationOptions = obj => obj.navigation.state.params;

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    onLoad() {
        event = this.props.navigation.getParam("event","No event");
        this.props.navigation.setParams({
            // title: this.props.navigation.state.params.id.toString(),
            title: event.name,
            customHeaderBackgroundColor: event.group.color,
            headerTintColor: 'white', // Back arrow color
            headerTitleStyle: { color: 'white' }, // Title color
            headerRight: (
                <TouchableWithoutFeedback  onPress={() => this.props.navigation.push('EditEvent', { event: event })}>
                    <MaterialIcon name='settings' {...headerStyles.iconProps} />
                </TouchableWithoutFeedback>
            )
        });
    }

    render() {
        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} showActivityIndicator={() => this.state.showActivityIndicator} navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
            
                <Container>
                    <Tabs tabBarUnderlineStyle={{backgroundColor:'black'}}>
                    <Tab tabStyle={{backgroundColor: "#EEEEEE"}} textStyle={{color:'black'}} activeTextStyle={{color:'black'}} activeTabStyle={{backgroundColor:'#EEEEEE'}} 
                    heading="Info">
                        <Text>1</Text>
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
                </Container>
            </AuthenticatedComponent>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen);