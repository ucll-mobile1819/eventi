import React from "react";
import { Header } from "react-navigation";
import { View, Platform } from "react-native";
import NavigatorStyles from './NavigatorStyles';

const CustomHeader = props => {
  return (
    <View
      style={{
        height: 56,
        backgroundColor: NavigatorStyles.colors.primaryTintColor,
        marginTop: Platform.OS == "ios" ? 20 : 0 
      }}
    >
        <Header {...props} />
    </View>
  );
};

export default CustomHeader;
