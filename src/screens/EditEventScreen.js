import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import { fetchEvent , putEvent} from '../actions/EventActions';
import { Container,Content, Item, Label, Input, Textarea, Text, H3, Button , Form} from 'native-base';
import ValidationComponent from '../components/ValidationComponent';
import DatePickerComponent from '../components/DatePickerComponent';
import PollTableComponent from '../components/PollTableComponent';
import { View } from 'react-native';

class EditEventScreen extends ValidationComponent {

    constructor(props) {
        super(props);
        this.state = this.getClearedState();
    }

    getClearedState() {
        return {
            event: this.props.emptyEvent,
            showActivityIndicator: true,

        };
    }

    putEvent(){

        this.props.putEvent(...this.state.event)
            .then(()=>{
                //RELOAD STATE
        })
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    onLoad() {
        let id = this.props.navigation.state.params.id;
        this.props.fetchEvent(id)
            .then(()=>{
                let event = this.props.events.find(e => e.id === this.props.navigation.state.params.id);
                
                this.updateState({
                    event: event,
                    showActivityIndicator: false,
                })
                this.props.navigation.setParams({
                    title: "Edit " + this.state.event.name,
                    customHeaderBackgroundColor: this.state.event.group.color,
                    headerTintColor: 'white', // Back arrow color
                    headerTitleStyle: { color: 'white' }, // Title color
                });
        })
    }

    render() {
        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} showActivityIndicator={() => this.state.showActivityIndicator} navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                <Container>
                    <Content padder>
                        <Form style={{ marginLeft: 15, marginRight: 15 }}>
                            {this.isFieldInError('name') && <Text style={{ color: 'red', marginLeft: 15 }}>{this.getErrorsInField('name')[0]}</Text>}
                            <Item floatingLabel style={{ marginLeft: 0 }}>
                                <Label>Name</Label>
                                <Input  
                                    value={this.state.event.name} 
                                    onChangeText={name => this.updateState({ name })} 
                                />
                            </Item>

                            <Item floatingLabel style={{ marginLeft: 0 }}>
                                <Label>Location Name</Label>
                                <Input 
                                    value={this.state.event.locationName}
                                    onChangeText={locationName => this.updateState({ locationName })} 
                                />
                            </Item>

                            <Item floatingLabel style={{ marginLeft: 0 }}>
                                <Label>Address</Label>
                                <Input
                                    value={this.state.event.address} 
                                    onChangeText={address => this.updateState({ address })} 
                                />
                            </Item>

                            <Textarea
                                rowSpan={5}
                                bordered
                                placeholder="Description"
                                style={{ width: undefined, marginTop: 20 }}
                                value={this.state.event.description}
                                onChangeText={description => this.updateState({ description })} />

                            <View style={{ paddingTop: 20 }}>
                                {this.state.event.type === 'poll' &&
                                    <View style={{ marginBottom: 20 }}>
                                        <H3 style={{ marginBottom: 20 }}>Poll</H3>

                                        {/* <PollTableComponent/> */}
                                    </View>
                                }
                                
                                {this.state.event.type === 'event' &&
                                    <View>
                                        <H3 style={{ marginBottom: 20 }}>Event: Start time & end time</H3>
                                        {this.isFieldInError('startTime') && <Text style={{ color: 'red' }}>{this.getErrorsInField('startTime')[0]}</Text>}
                                        <DatePickerComponent
                                            style={{ width: 250, marginBottom: 20 }}
                                            placeholder="Start Time"
                                            mode="datetime"
                                            minDate={new Date()}
                                            maxDate={this.state.event.endTime || new Date(Date.now() + 500 * 365 * 24 * 60 * 60 * 1000)}
                                            onDateChange={startTime => {
                                                this.updateState({ startTime });
                                            }}
                                            date={this.state.event.startTime}
                                        />
                                        {this.isFieldInError('endTime') && <Text style={{ color: 'red' }}>{this.getErrorsInField('endTime')[0]}</Text>}
                                        <DatePickerComponent
                                            style={{ width: 250, marginBottom: 20 }}
                                            placeholder="End Time"
                                            mode="datetime"
                                            minDate={this.state.event.startTime || new Date()}
                                            maxDate={new Date(Date.now() + 500 * 365 * 24 * 60 * 60 * 1000)}
                                            onDateChange={endTime => {
                                                this.updateState({ endTime });
                                            }}
                                            date={this.state.event.endTime}
                                        />
                                    </View>
                                }
                            </View>
                            <Button onPress={() => this.putEvent()}><Text>testing</Text></Button>
                        </Form>
                    </Content>
                </Container>
            </AuthenticatedComponent>
        );
    }
}

const mapStateToProps = state => {
    return {
        events: state.event.events,
        emptyEvent: state.event.emptyEvent,
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchEvent , putEvent}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EditEventScreen);