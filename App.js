import React, { Component } from 'react';
import { View } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";

import { LoginScreen } from './src/screens/LoginScreen'
import { RegisterScreen } from './src/screens/RegisterScreen'

const AppNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    Register: RegisterScreen
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#32CD32',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    },
  }
);

export default createAppContainer(AppNavigator);
