import React, { Component } from 'react';
import { View, Button } from 'react-native';

export default class NavigatorComponent extends Component {
    render() {
        return (
            <View style={{flexDirection: 'row'}}>
                {
                    this.props.navigationState.routes.map((route) => {
                    return route.key==="HiddenTab" ? null : <Button title={route.key} onPress={()=> {this.props.navigation.navigate(route.key)}}></Button>
                    })
                }
            </View>
        );
    }
}