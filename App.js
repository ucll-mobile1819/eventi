import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './src/reducers';
import thunk from 'redux-thunk';
import Navigator from './src/components/Navigator';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Navigator />
            </Provider>
        );
    }
}