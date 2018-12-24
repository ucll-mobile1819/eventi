import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Text,Button, Container, Content, Item,Input, Label, Form, Header } from 'native-base';
import { isAuthenticated, login } from '../auth';
import { NavigationEvents } from 'react-navigation';
import { Fonts } from '../utils/Fonts';

export default class LoginScreen extends Component {
    constructor(props) {
        console.log('LOADING LOGIN SCREEN------');
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    async onNavWillFocus() {
        console.log('ON NAV WILL FOCUS');
        if (await isAuthenticated()) {
            console.log('YOU ARE AUTHENTICATED');
            this.props.navigation.navigate('Home');
        }
    }

    async login() {
        let response = await login(this.state.username, this.state.password);
        if (!response) return;
        console.log('NAVIGATING TO HOME...');
        this.props.navigation.navigate('Home');
    }

    render() {
        return (
            <Container>
                <Content>
                <NavigationEvents onWillFocus={() => this.onNavWillFocus()} />
                <Text style={styles.title}>Eventi</Text>
                <Form>
                <Item floatingLabel>
                    <Label><Text>Username</Text></Label>
                  <Input 
                    value={this.state.username}
                    onChangeText={username => this.setState({ username })}
                    />
                 </Item>
                
                 <Item floatingLabel>
                 <Label><Text>Password</Text></Label>
                  <Input 
                    secureTextEntry={true}
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                    />
                 </Item>
                
                <Button
                    style={{marginLeft:10, marginTop:20,marginRight:10}}
                    
                    block
                    onPress={() => this.login()}>
                    <Text>Login</Text>
                </Button>
                
                </Form>
                <Text 
                    onPress={() => this.props.navigation.navigate('Register')}
                    style={{ color: 'darkblue', marginTop: 10,alignSelf:"center" }}
                >Not a member yet? Register here.</Text>
                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.OpenSansBold,
    fontSize: 40,
    color: 'black',
    alignSelf: "center"
    
  },
  container:{
    // alignItems: "center",

   },
});