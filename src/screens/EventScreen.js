import React from 'react';
import { Text, Button, TouchableWithoutFeedback ,StyleSheet} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import headerStyles from '../styles/headerStyles';
import { Container, Tabs, Tab } from 'native-base';
import { Header } from 'react-navigation';
import { color } from 'color';

var event;
var styles;
class EventScreen extends React.Component {
    static navigationOptions = obj => obj.navigation.state.params;

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

    loadStyles(){
        styles = StyleSheet.create({
            Tabs:{
                backgroundColor: event.group.color
            }
        });
    }
    render() {
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
            
                <Container>
                    <Tabs>
                    <Tab tabStyle={styles.Tabs} activeTabStyle={{ backgroundColor: "green" }} heading="Tab1">
                        <Text>1</Text>
                    </Tab>
                    <Tab heading="Tab2">
                        <Text>2</Text>
                    </Tab>
                    <Tab heading="Tab3">
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