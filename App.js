import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './src/reducers';
import GroupsScreen from './src/screens/GroupsScreen';
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default class App extends Component {
    render() {
        return (
            <Provider store={ store }>
                <GroupsScreen></GroupsScreen>
            </Provider>
        );
    }
}
