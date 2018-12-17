import { createStackNavigator, TabNavigator, StackNavigator, NavigationActions, StackActions } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import GroupsScreen from '../screens/GroupsScreen';
import AddEventScreen from '../screens/AddEventScreen';
import JoinGroupScreen from '../screens/JoinGroupScreen';
import ProfileScreen from '../screens/ProfileScreen';
import React from 'react';
import GroupSettingsScreen from '../screens/GroupSettingsScreen';
import GroupScreen from '../screens/GroupScreen';
import EventScreen from '../screens/EventScreen';
import EditEventScreen from '../screens/EditEventScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import NavigatorStyles from "./NavigatorStyles";
import CustomTabBarBottom from "./CustomTabBarBottom";
import DefaultHeader from "./DefaultHeader";

let headerDefaultNavigationConfig = {
    header: props => <DefaultHeader {...props} />,
    ...NavigatorStyles
};

let HomeTab = StackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            header: null
        }
    },
    EditEvent: {
        screen: EditEventScreen,
        navigationOptions: {
            headerTitle: 'Edit event', 
        }
    },
    Event: {
        screen: EventScreen,
    },
    AddEvent: {
        screen: AddEventScreen,
        navigationOptions: {
            headerTitle: 'Add event',
        }
    },
},{
    navigationOptions: {
        ...headerDefaultNavigationConfig
    }
});

let GroupsTab = StackNavigator({
    Groups: {
        screen: GroupsScreen,
        navigationOptions: {
            headerLeft: null,
            headerTitle: 'Groups'
        }
    },
    CreateGroup: {
        screen: CreateGroupScreen,
        navigationOptions: {
            headerTitle: 'Create group',
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
    },
},{
    navigationOptions: {
        ...headerDefaultNavigationConfig
    }
});

let JoinGroupTab = StackNavigator({
    JoinGroup: {
        screen: JoinGroupScreen,
        navigationOptions: {
            headerLeft: null,
            headerTitle: 'Join group',
        }
    }
},{
    navigationOptions: {
        ...headerDefaultNavigationConfig
    }
});

let ProfileTab = StackNavigator({
    Profile: {
        screen: ProfileScreen,
        navigationOptions: {
            headerLeft: null,
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
    ['Join group']: JoinGroupTab,
    Profile: ProfileTab,
},
{
    initialRouteName: 'Home',
    navigationOptions: ({ navigation }) => {
        const { routeName } = navigation.state;
        return {
            tabBarIcon: ({ tintColor }) => {
                let icon;
                switch(routeName) {
                    case 'Home':
                        icon = <FontAwesomeIcon name='home' size={25} color={tintColor} />; break;
                    case 'Groups':
                        icon = <FontAwesomeIcon name='group' size={25} color={tintColor} />; break;
                    case 'Join group':
                        icon = <AntDesignIcon name='addusergroup' size={25} color={tintColor} />; break;
                    case 'Profile':
                        icon = <FontAwesomeIcon name='user' size={25} color={tintColor} />; break;
                    default:
                        break;
                }
                return icon;
            },
            tabBarOnPress: ({ scene, jumpToIndex }) => {
                jumpToIndex(scene.index);
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: scene.route.routes[0].routeName })],
                });
                navigation.dispatch(resetAction);
            }
        };
    },
    tabBarOptions: {
        activeTintColor: NavigatorStyles.colors.darkTintColor,
        inactiveTintColor: NavigatorStyles.colors.inactiveTintColor,
        style: {
          height: 60,
          paddingVertical: 5,
          backgroundColor: "transparent"
        },
        labelStyle: {
          fontSize: 12,
          lineHeight: 20
        }
      },
      tabBarComponent: props => <CustomTabBarBottom {...props}/>,
      tabBarPosition: "bottom",
      animationEnabled: true,
      swipeEnabled: false
});

let Navigator = createStackNavigator({
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            headerTitle: 'Login',
            header: null
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
    },
},
{
    initialRouteName: "TabNavigator",
    navigationOptions: {
        ...NavigatorStyles,
        animationEnabled: true
    },
});

export default Navigator;