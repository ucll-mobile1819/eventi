import React from 'react';
import { Container, Header, Tab, Tabs, ScrollableTab, Text } from 'native-base';
import {Going } from '../components/Tabs/Going';
import {NotGoing} from '../components/Tabs/NotGoing';
import {History} from '../components/Tabs/History';
import {CreatedByMe} from '../components/Tabs/CreatedByMe';
class HomeScreen extends React.Component{
    
    // constructor(props){super(props)}
    render(){
        return(
            <Container>
            <Tabs>
                <Tab heading="Going">
                    <Going />
                </Tab>
                <Tab heading="Not Going">
                    <NotGoing />
                </Tab>
                <Tab heading="History">
                    <History />
                </Tab>
                <Tab heading="Created">
                    <CreatedByMe />
                </Tab>
            </Tabs>
        </Container>
        )
    }
}
export default HomeScreen;