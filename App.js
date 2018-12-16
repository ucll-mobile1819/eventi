import React, {Component} from 'react';
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './src/reducers';
import thunk from 'redux-thunk';
import Navigator from './src/navigator/Navigator';

const store = createStore(rootReducer, applyMiddleware(thunk));

YellowBox.ignoreWarnings([
    "TabBarBottom is deprecated",
    "jumpToIndex"
]);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Navigator />
            </Provider>
        );
    }
}