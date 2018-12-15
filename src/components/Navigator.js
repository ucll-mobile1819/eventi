import { createBottomTabNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { isAuthenticated } from '../auth';
import HomeScreen from '../screens/HomeScreen';
import GroupsScreen from '../screens/GroupsScreen';

export default createBottomTabNavigator({
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            tabBarLabel: 'Login'
        }
    },
    Register: {
        screen: RegisterScreen,
        navigationOptions: {
            tabBarLabel: 'Register'
        },
    },
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            tabBarLabel: 'Home'
        }
    },
    Groups: {
        screen: GroupsScreen,
        navigationOptions: {
            tabBarLabel: 'Groups'
        }
    }
}, {
    initialRouteName: 'Login',
    tabBarOptions: {
        style: {

        }
    }
});