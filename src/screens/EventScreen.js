import React from 'react';
import { Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import headerStyles from '../styles/headerStyles';
import { Container, Tabs, Tab , Button, ActionSheet, View} from 'native-base';
import { Header } from 'react-navigation';
import { color } from 'color';
import { fetchEvent } from '../actions/EventActions';
import Icon from 'react-native-vector-icons/FontAwesome';


const red = '#DD1111';
const green = '#11DD52';
const grey = '#a8aeb7';
class EventScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showActivityIndicator: true
        };
    }
    static navigationOptions = obj => obj.navigation.state.params;

    onLoad() {
        this.props.fetchEvent(this.props.navigation.state.params.id)
            .then(() => {
                this.setState({ showActivityIndicator: false });
                if (this.props.error) return;
                const {
                    name,
                    description,
                    startTime,
                    type,
                    status
                } = this.props.event;
                this.props.navigation.setParams({
                    title: this.props.event.name,
                    customHeaderBackgroundColor: this.props.event.group.color,
                    headerTintColor: 'white', // Back arrow color
                    headerTitleStyle: { color: 'white' }, // Title color
                    headerRight: (
                        <View>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('GroupSettings', { id: this.props.group.id })}>
                                <MaterialIcon name='settings' {...headerStyles.iconProps} />
                            </TouchableWithoutFeedback>
                        </View>
                    )
                });
            });
    }

    render() {
        return (
            <AuthenticatedComponent showActivityIndicator={() => this.state.showActivityIndicator}  navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
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

const mapStateToProps = state => {
    return {
        event: state.event.event,
        loading: state.group.loading,
        error: state.group.error
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({fetchEvent}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen);