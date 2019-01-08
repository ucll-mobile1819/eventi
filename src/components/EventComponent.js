import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Text, Right, View, Toast } from 'native-base';
import { Fonts } from '../utils/Fonts';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableWithoutFeedback } from 'react-native';
import AuthenticatedComponent from './AuthenticatedComponent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeStatus } from '../actions/EventActions';

const dateIcon = <Icon name="calendar" size={30} color="#FFF" />;
const pollIcon = <MaterialCommunityIcon name="poll" size={30} color="#FFF" />;

const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

const red = '#DD1111';
const green = '#11DD52';
const grey = '#a8aeb7';

class EventComponent extends React.Component{
    constructor(props) {
        super(props);
    }
    getDateDisplayFormat(date) {
        return date.getDate() + '\n' + months[date.getMonth()];
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
    goingToEvent(event){
        //Set event on going
        this.props.changeStatus(event.id , this.props.event.status === 'Going' ? null : 'Going');
    }
    toEvent(event){
        //Set event on going
        //Redirect to event info page
        this.props.nav.push('Event', {id: event.id}  );
    }
    notGoingToEvent(event){
        //Set event on not going
        this.props.changeStatus(event.id , this.props.event.status === 'Not going' ? null : 'Not going');
    }
    
    render() {
        const {
            name,
            description,
            startTime,
            type,
            status
        } = this.props.event;
        const styles = getStyles(this.props.event.group.color);

        return (
            <TouchableWithoutFeedback  onPress={() => this.toEvent(this.props.event)}>
            <Card>
                <CardItem style={styles.cardItem}>
                    <View style={styles.date}>
                        <Text style={styles.dateText}>
                            {type === 'poll' ?
                                pollIcon :
                                startTime instanceof Date ?
                                this.getDateDisplayFormat(startTime) :
                                dateIcon
                            }
                            {type === 'poll' && "\nPoll"}
                        </Text>
                    </View>
                    <View style={{marginLeft:4, flex: 1}}>
                        <Text style={{fontFamily: Fonts.OpenSans}} numberOfLines={1}>
                            {name}
                        </Text>
                        <Text numberOfLines={1} style={{color: '#444', fontSize: 12}}>
                            {description}
                        </Text>
                        <Text style={{color: '#444', fontSize: 12}}>
                        {this.props.event.group.name} {this.getTimeDisplayFormat(startTime) === '' ? '' : '-'} {this.getTimeDisplayFormat(startTime)}
                        </Text>
                    </View>
                    {type === 'event' ?
                        <>
                            <TouchableWithoutFeedback onPress={() => this.goingToEvent(this.props.event)}><View><Right style={styles.attendanceIcon}>
                            <Icon name="check" size={30} color={status == 'Going'? green : grey} />
                            </Right></View></TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.notGoingToEvent(this.props.event)}><View><Right style={styles.attendanceIcon}>
                            <Icon name="close" size={30} color={status == 'Not going'? red : grey} />
                            </Right></View></TouchableWithoutFeedback>
                        </> :
                        null
                    }
                </CardItem>
            </Card>
            </TouchableWithoutFeedback>
        );
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
    bindActionCreators( {changeStatus} , dispatch)
);

const getStyles = color => StyleSheet.create({
    cardItem: {
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    date: {
        width: 55,
        height: 60,
        backgroundColor: color,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateText: {
        textAlign: "center",
        color: 'white',
        fontFamily: Fonts.OpenSansBold
    },
    attendanceIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(EventComponent);