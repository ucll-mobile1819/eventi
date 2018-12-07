import { createBottomTabNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import GroupsScreen from '../screens/GroupsScreen';

const AppNavigator = createBottomTabNavigator(
    {
        Login: LoginScreen,
        Register: RegisterScreen,
        Groups: GroupsScreen,
    },
    {
        initialRouteName: 'Login',
        tabBarOptions: {
            style: {
                display: 'none'
            }
        }
    }
);

export default AppNavigator;