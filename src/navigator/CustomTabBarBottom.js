import React from "react";
import {
  TabBarBottom
} from "react-navigation";
import { View, TouchableWithoutFeedback } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigatorStyles from './NavigatorStyles';

const CustomTabBarBottom = props => {
    return (
        <View>
            <TouchableWithoutFeedback style={styles.container} onPress={() => {
                props.navigation.navigate('AddEvent')
            }}>
                <View style={styles.actionButton}>
                    <Ionicons name={"ios-add"} size={45} color={"#fff"} style={styles.buttonIcon}/>
                </View>
            </TouchableWithoutFeedback>
            <View style={{backgroundColor: "#fff"}}>
                <TabBarBottom {...props } />
            </View>
        </View>
    );
};

const styles = {
  actionButton: {
    backgroundColor: NavigatorStyles.colors.darkTintColor,
    width: 50,
    height: 50,
    borderRadius: 50/2,
    bottom: -20,
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: 999
  },
  buttonIcon: {
    textAlign: "center",
    marginTop: 2,
  },
  container: {
      zIndex: 999
  }
}

export default CustomTabBarBottom;
