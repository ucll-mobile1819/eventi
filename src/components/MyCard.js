import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Text, Right, View } from 'native-base';
import { Fonts } from './../utils/Fonts';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const cross = (<Icon name="close" size={30} color="#DD1111" />)
const check = (<Icon name="check" size={30} color="#11DD52" />)
const dateIcon = (<Icon name="calendar" size={30} color="#FFF" />)

class MyCard extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
    
    var olddate = this.props.date;
    var date = replaceAll("\n" , " ", olddate);
    if(date == ""){
      console.log(11);
        date = dateIcon;
    }
    const styles = StyleSheet.create({
      cardItem:{
        paddingLeft: 0 , paddingTop:0 ,paddingBottom:0
      },
      date:{
        height:50,
        paddingTop:10,
        flex: 1, 
        backgroundColor: this.props.color
      },
      dateText:{
        textAlign: "center",
        color:'white',
        fontFamily: Fonts.OpenSansBold
      },
    });
    if(this.props.buttons === "true"){
      return(
      <Card style={{height:50}}>
        <CardItem style={styles.cardItem}>
        <View style={ styles.date }>
          <Text style={styles.dateText}>
            {date}
          </Text>
        </View>
        <View style={{ flex: 4, marginLeft:4 }}>
          <Text style={{fontFamily: Fonts.OpenSans}} >
          {this.props.title}
          
          </Text>
        </View>
        <Right>{check}</Right>
        <Right>{cross}</Right>
        </CardItem>
      </Card>
      )
    }

    return(
      <Card style={{height:50}}>
        <CardItem style={styles.cardItem}>
        <View style={ styles.date }>
          <Text style={styles.dateText}>
            {date}
          </Text>
        </View>
        <View style={{ flex: 4, marginLeft:4 }}>
          <Text style={{fontFamily: Fonts.OpenSans}} >
          {this.props.title}
          
          </Text>
        </View>
        </CardItem>
      </Card>
      )
  }

}
function replaceAll(w, r , s){
  if(s !== s.replace(r , w)){
    return replaceAll(w,r,s.replace(r , w));
  }
  return s

}
export {MyCard};