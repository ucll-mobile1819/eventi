/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import HomeScreen from './src/screens/Homescreen';
// AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerComponent(appName, () => HomeScreen);