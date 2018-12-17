import React from "react";
import { Header } from "react-navigation";
import { View, Platform } from "react-native";
import NavigatorStyles from '../navigator/NavigatorStyles';

const DefaultHeader = props => {
    const doObjectPropertiesExist = (obj, props) => { // (obj, ['a','b','c']) checks for obj.a.b.c
        if (!props || props.length === 0) return true;
        if (!obj[props[0]]) return false;
        return doObjectPropertiesExist(obj[props.shift()], props);
    };

    let customOptions = { backgroundColor: NavigatorStyles.colors.primaryTintColor };
    let params = {};
    if (doObjectPropertiesExist(props, ['scene', 'route', 'params', 'customHeaderBackgroundColor'])) {
        params = props.scene.route.params;
    } else if (doObjectPropertiesExist(props, ['scene', 'descriptor', 'options'])) {
        params = props.scene.descriptor.options;
    }
    if (params.customHeaderBackgroundColor) customOptions.backgroundColor = params.customHeaderBackgroundColor;

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
