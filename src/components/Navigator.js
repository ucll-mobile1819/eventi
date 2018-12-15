import { createStackNavigator, TabNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import GroupsScreen from '../screens/GroupsScreen';
import AddEventScreen from '../screens/AddEventScreen';
import JoinGroupScreen from '../screens/JoinGroupScreen';
import ProfileScreen from '../screens/ProfileScreen';
import React from 'react';
import NavigatorComponent from './NavigatorComponent';
import GroupSettingsScreen from '../screens/GroupSettingsScreen';
import GroupScreen from '../screens/GroupScreen';
import EventScreen from '../screens/EventScreen';
import EditEventScreen from '../screens/EditEventScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';

let headerDefaultNavigationConfig = {};

let HeaderStyles = {};

let HomeTab = createStackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            headerLeft: null,
            headerTitle: 'Home'
        }
    }
},{
    navigationOptions: {
        ...headerDefaultNavigationConfig
    }
});

let GroupsTab = createStackNavigator({
    Groups: {
        screen: GroupsScreen,
        navigationOptions: {
            headerLeft: null,
            headerTitle: 'Groups'
        }
    }
},{
    navigationOptions: {
        ...headerDefaultNavigationConfig
    }
});

/*let AddEventTab = createStackNavigator({
    AddEvent: {
        screen: AddEventScreen,
        navigationOptions: {
            headerLeft: null,
            headerTitle: 'AddEvent'
        }
    }
},{
    navigationOptions: {
        ...headerDefaultNavigationConfig
    }
});*/

let JoinGroupTab = createStackNavigator({
    JoinGroup: {
        screen: JoinGroupScreen,
        navigationOptions: {
            headerLeft: null,
            headerTitle: 'JoinGroup'
        }
    }
},{
    navigationOptions: {
        ...headerDefaultNavigationConfig
    }
});

let ProfileTab = createStackNavigator({
    Profile: {
        screen: ProfileScreen,
        navigationOptions: {
            headerLeft: null,
            headerTitle: 'Profile'
        }
    }
},{
    navigationOptions: {
        ...headerDefaultNavigationConfig
    }
});

let tabNavigator = TabNavigator({
    Home: HomeTab,
    Groups: GroupsTab,
    JoinGroup: JoinGroupTab,
    Profile: ProfileTab,
},
{
    tabBarComponent: props => <NavigatorComponent {...props} />,
    initialRouteName: 'Home',
    navigationOptions: ({ navigation }) => {
        const { routeName, routes } = navigation.state;
        return {}; /*return {
            tabBarIcon: ({ focused, tintColor }) => {
                let iconName;
                switch(routeName) {
                    case "Account":
                        iconName = `ios-people${focused ? '' : '-outline'}`; break;
                    case "Phone":
                        iconName = `ios-megaphone${focused ? '' : '-outline'}`; break;
                    case "History":
                        iconName = `ios-folder${focused ? '' : '-outline'}`; break;
                    case "Results":
                        iconName = `ios-sunny${focused ? '' : '-outline'}`; break;
                    default:
                        break;
                }
                // You can return any component that you like here! For demo we use an
                // icon component from react-native-vector-icons
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            }
        };*/
    },
});

let Navigator = createStackNavigator({
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            headerTitle: 'Login',
            header: null
        }
    },
    CreateGroup: {
        screen: CreateGroupScreen,
        navigationOptions: {
            headerTitle: 'CreateGroup',
        }
    },
    EditEvent: {
        screen: EditEventScreen,
        navigationOptions: {
            headerTitle: 'EditEvent',
        }
    },
    Event: {
        screen: EventScreen,
        navigationOptions: {
            headerTitle: 'Event',
        }
    },
    Group: {
        screen: GroupScreen,
        navigationOptions: {
            headerTitle: 'Group',
        }
    },
    GroupSettings: {
        screen: GroupSettingsScreen,
        navigationOptions: {
            headerTitle: 'GroupSettings',
        }
    },
    Register: {
        screen: RegisterScreen,
        navigationOptions: {
            headerTitle: 'Register',
            header: null
        }
    },
    TabNavigator: {
        screen: tabNavigator,
        navigationOptions: {
            header: null
        }
    }
},
{
    initialRouteName: "TabNavigator",
    navigationOptions: {
        ...HeaderStyles,
        animationEnabled: true
    }
});

export default Navigator;