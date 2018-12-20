import React, { Component } from 'react';
import { Image, Text } from 'react-native';

class Bananas extends Component {
  render() {
    return (
      <Text>{this.props.url}</Text>
      // <Image source={this.props.url} style={{width: 193, height: 110}}/>
    );
  }
}
export { Bananas }
