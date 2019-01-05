import React from "react";
import {
  TabBarBottom
} from "react-navigation";
import { View, TouchableWithoutFeedback, StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigatorStyles from './NavigatorStyles';

const CustomTabBarBottom = props => {
    return (
        <View>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => {
                    props.navigation.navigate('AddEvent')
                }}>
                    <View style={styles.actionButton}>
                        <Ionicons name={"ios-add"} size={45} color={"#fff"} style={styles.buttonIcon}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={{backgroundColor: "#fff"}}>
                <TabBarBottom {...props } />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    actionButton: {
        backgroundColor: NavigatorStyles.colors.darkTintColor,
        width: 50,
        height: 50,
        borderRadius: 50/2,
        bottom: 40,
        position: "absolute",
        zIndex: 999
    },
    buttonIcon: {
        textAlign: "center",
        marginTop: 2,
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default CustomTabBarBottom;
