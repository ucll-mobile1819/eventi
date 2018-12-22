import React from 'react';
import { Container, Header, Content,CardItem, Text, Icon, Right, View ,Button} from 'native-base';
import { Fonts } from '../../utils/Fonts';
import { StyleSheet } from 'react-native';
import { MyCard }from '../MyCard';
import {Bananas} from '../Banana';
import { connect }from 'react-redux';

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

class Going extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      count:1,
    };
    this.increment = this.increment.bind(this);
  }
  increment(number){
    this.setState({ count: this.state.count + 1});
  };

  render(){
    
    return(
      <Container>
        <MyCard date="11 Apr" title="dd0" color="#00CC99" buttons="true" />
        <Text>{this.state.count}</Text>
          <Button onPress={this.increment}>
            <Text>Click Me!</Text>
          </Button>
      </Container>
    );
  }
}


export default (Going);