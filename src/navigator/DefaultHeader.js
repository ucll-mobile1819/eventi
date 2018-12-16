import React from "react";
import { Header } from "react-navigation";
import { View, Platform } from "react-native";
import NavigatorStyles from '../navigator/NavigatorStyles';

const DefaultHeader = props => {
    let customOptions = { backgroundColor: NavigatorStyles.colors.primaryTintColor };
    if (props.scene && props.scene.descriptor && props.scene.descriptor.options) {
        let options = props.scene.descriptor.options;
        if (options.customHeaderBackgroundColor) customOptions.backgroundColor = options.customHeaderBackgroundColor;
    }
    return (
        <View
            style={{
                height: 56,
                ...customOptions,
                marginTop: Platform.OS == "ios" ? 20 : 0 
            }}
        >
            <Header {...props} />
        </View>
    );
};

export default DefaultHeader;
