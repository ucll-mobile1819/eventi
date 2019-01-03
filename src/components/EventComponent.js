import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Text, Right, View } from 'native-base';
import { Fonts } from '../utils/Fonts';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const cross = <Icon name="close" size={30} color="#DD1111" />;
const check = <Icon name="check" size={30} color="#11DD52" />;
const dateIcon = <Icon name="calendar" size={30} color="#FFF" />;
const pollIcon = <MaterialCommunityIcon name="poll" size={30} color="#FFF" />;
const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

export default class EventComponent extends React.Component{
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

    render() {
        const {
            name,
            description,
            startTime,
            type
        } = this.props.event;
        const styles = getStyles(this.props.event.group.color);

        return (
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
                            {this.getTimeDisplayFormat(startTime)}
                        </Text>
                    </View>
                    {type === 'event' ?
                        <>
                            <View><Right style={styles.attendanceIcon}>{check}</Right></View>
                            <View><Right style={styles.attendanceIcon}>{cross}</Right></View>
                        </> :
                        null
                    }
                </CardItem>
            </Card>
        );
    }

}
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