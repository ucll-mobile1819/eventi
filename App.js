import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen'

export default class App extends Component {
  render() {
    return (
      <View>
        <LoginScreen/>
      </View>
    );
  }
};
