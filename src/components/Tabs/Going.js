import React from 'react';
import { Container, Header, Content,CardItem, Text, Icon, Right, View } from 'native-base';
import { Fonts } from '../../utils/Fonts';
import { StyleSheet } from 'react-native';
import { MyCard }from '../MyCard';
import {Bananas} from '../Banana';
const styles = StyleSheet.create({
  card:{
    paddingLeft: 0 , paddingTop: 0 ,paddingBottom:0
  },
  date:{
    flex: 1, 
    backgroundColor: '#00CC99',
  },
  dateText:{
    textAlign: "center",
    color:'white'
  },
});

const Going = () => (
  <Container>
    <MyCard date="11 Apr" title="Verjaardag Senne" color="#00CC99" buttons="true" />
  </Container>

);

export {Going};