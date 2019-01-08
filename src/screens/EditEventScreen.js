import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import { fetchEvent, putEvent, fetchEvents, endPoll } from '../actions/EventActions';
import { Container, Content, Item, Label, Input, Textarea, Text, H3, Button, Form } from 'native-base';
import ValidationComponent from '../components/ValidationComponent';
import DatePickerComponent from '../components/DatePickerComponent';
import PollTableComponent from '../components/PollTableComponent';
import { deleteEvent } from '../network/event';
import { View, Alert } from 'react-native';

class EditEventScreen extends ValidationComponent {

    constructor(props) {
        super(props);
        this.state = this.getClearedState();
    }

    getClearedState() {
        return {
            showActivityIndicator: true,
            id: undefined,
            type: '',
            name: '',
            locationName: '',
            address: '',
            description: '',
            startTime: null,
            endTime: null,
            pollDates: [],
            pollDateVotes: [],
            selectedPollDateId: null,
            pollDateFixed: false,
            showActivityIndicator: true
        };
    }

    async updateEvent() {
        if (this.submitting) return;
        this.submitting = true;
        if (!this.validateForm()) {
            this.submitting = false;
            return;
        }

        let pollDatesToPut = this.state.pollDates.map(el => {
            let newEl = { startTime: el.startTime, endTime: el.endTime };
            if (el.id >= 0) {
                newEl.id = el.id;
                newEl.votes = el.votes;
            }
            return newEl;
        });
        
        this.props.putEvent(
            this.state.id,
            this.state.name,
            this.state.description,
            this.state.startTime,
            this.state.endTime,
            this.state.locationName,
            this.state.address,
            pollDatesToPut)
            .then(() => {
                if (this.state.pollDateFixed && this.state.selectedPollDateId !== null) {
                    let theChosenOne = this.state.pollDates.filter(el => el.id === this.state.selectedPollDateId);
                    if (theChosenOne.length === 0 || !(this.getEvent().pollDates instanceof Array) || this.getEvent().pollDates.length === 0 ) {
                        this.updateState({ ...this.getEvent() });
                        this.props.navigation.navigate('Home');
                        this.submitting = false;
                        return;
                    }
                    theChosenOne = theChosenOne[0];
                    this.getEvent().pollDates.forEach(el => {
                        if (el.startTime.getTime() === theChosenOne.startTime.getTime() && el.endTime.getTime() === theChosenOne.endTime.getTime()) {
                            theChosenOne = el;
                        }
                    });
                    if (theChosenOne.id < 0 || theChosenOne.id === null) {
                        console.log('The chosen one pollDate to convert into event could not be found, this shouldnt\'ve happened...');
                        this.updateState({ ...this.getEvent() });
                        this.props.navigation.navigate('Home');
                        this.submitting = false;
                    } else {
                        this.props.endPoll(this.getEvent().id, theChosenOne.id)
                        .then(() => {
                            this.updateState({ ...this.getEvent() });
                            this.props.navigation.navigate('Home');
                            this.submitting = false;
                        });
                    }
                } else {
                    this.updateState({ ...this.getEvent() });
                    this.props.navigation.navigate('Home');
                    this.submitting = false;
                }
            })
    }

    getEvent() {
        let events = this.props.events.filter(el => el.id === this.props.navigation.state.params.id);
        return events.length === 0 ? null : events[0];
    }

    async askDeleteEvent() {
        Alert.alert(
            'Delete event',
            'Are you sure you want to delete this event?',
            [
                { text: 'Delete', onPress: () => this.deleteEvent() },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: false }
        );
    }

    async deleteEvent() {
        let response = await deleteEvent(
            this.state.id,
            true
        );

        if (response !== false) {
            await this.props.fetchEvents();
            Alert.alert('Event deleted', 'The event was successfully deleted.');
            this.updateState(this.getClearedState());
            this.props.navigation.navigate("Home");
        }
    }

    validateForm() {
        if (!this.validate({
            name: { name: 'Name', required: true, minlength: 2, maxlength: 50 }
        })) {
            return false;
        }

        if (this.state.type === "event") {

            if (!this.validate({
                startTime: { name: 'Start Time', required: true },
                endTime: { name: 'End Time', required: true },

            })) {
                return false;
            }

            if (this.state.startTime > this.state.endTime) {
                fetchFailure({ status: 400, error: 'You choose an end time that is before your start time' });
                return false;
            }
        }

        if (this.state.type === "poll") {
            if (this.state.pollDates.length === 0) {
                fetchFailure({ status: 400, error: 'You must add at least 1 poll date' });
                return false;
            }
        }

        return true
    }

    newPollDateAdded(newPollDate) {
        // New poll dates don't have ids. But for removing them, we need to be able to identify them
        // So we add negative ids for new items and make sure to remove these ids before doing a POST/PUT to the api
        let id = Math.min(...this.state.pollDates.map(el => el.id), 0) - 1;
        newPollDate.id = id;

        this.updateState({
            pollDates: [...this.state.pollDates, newPollDate],
        });
    }

    pollDateRemoved(id) {
        this.updateState({
            pollDates: this.state.pollDates.filter(el => el.id !== id),
        });
    }

    pollDateSelected(selectedPollDateId) {
        this.updateState({ selectedPollDateId });
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    togglePickFinalTime() {
        if (this.state.selectedPollDateId === null) return;
        this.setState({ pollDateFixed: !this.state.pollDateFixed });
    }

    onLoad() {
        let id = this.props.navigation.state.params.id;
        this.props.fetchEvent(id)
            .then(() => {
                this.updateState({ ...this.props.event, showActivityIndicator: false });

                this.props.navigation.setParams({
                    title: "Edit " + this.state.name,
                    customHeaderBackgroundColor: this.state.group.color,
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
                                    value={this.state.name}
                                    onChangeText={name => this.updateState({ name })}
                                />
                            </Item>

                            <Item floatingLabel style={{ marginLeft: 0 }}>
                                <Label>Location Name</Label>
                                <Input
                                    value={this.state.locationName}
                                    onChangeText={locationName => this.updateState({ locationName })}
                                />
                            </Item>

                            <Item floatingLabel style={{ marginLeft: 0 }}>
                                <Label>Address</Label>
                                <Input
                                    value={this.state.address}
                                    onChangeText={address => this.updateState({ address })}
                                />
                            </Item>

                            <Textarea
                                rowSpan={5}
                                bordered
                                placeholder="Description"
                                style={{ width: undefined, marginTop: 20 }}
                                value={this.state.description}
                                onChangeText={description => this.updateState({ description })} />

                            <View style={{ paddingTop: 20 }}>
                                {this.state.type === 'poll' &&
                                    <View style={{ marginBottom: 20 }}>
                                        <H3 style={{ marginBottom: 20 }}>Poll</H3>

                                        <PollTableComponent
                                            mode='configure'
                                            pollDates={this.state.pollDates}
                                            pollDateVotes={this.state.pollDateVotes}
                                            showAmountOfVotes={true}
                                            newPollDateAdded={this.newPollDateAdded.bind(this)}
                                            pollDateRemoved={this.pollDateRemoved.bind(this)}
                                            pollDateSelected={this.pollDateSelected.bind(this)}
                                            selectable={true}
                                            fixed={() => this.state.pollDateFixed}
                                            defaultBackgroundColor={true}
                                        />
                                        <Text style={{ fontSize: 10, marginTop: 15, alignContent: 'center', alignSelf: 'center', textAlign: 'center', alignItems: 'center' }}>Select a date option and click this button to end the poll and lock in the final time.</Text>
                                        <Button style={{ width: undefined, marginTop: 5 }} block primary onPress={() => this.togglePickFinalTime()}>
                                            <Text>{this.state.pollDateFixed ? "Deselect final time" : "Pick final time"}</Text>
                                        </Button>



                                    </View>
                                }

                                {this.state.type === 'event' &&
                                    <View>
                                        <H3 style={{ marginBottom: 20 }}>Event: Start time & end time</H3>
                                        {this.isFieldInError('startTime') && <Text style={{ color: 'red' }}>{this.getErrorsInField('startTime')[0]}</Text>}
                                        <DatePickerComponent
                                            style={{ width: 250, marginBottom: 20 }}
                                            placeholder="Start Time"
                                            mode="datetime"
                                            minDate={new Date()}
                                            maxDate={this.state.endTime || new Date(Date.now() + 500 * 365 * 24 * 60 * 60 * 1000)}
                                            onDateChange={startTime => {
                                                this.updateState({ startTime });
                                            }}
                                            date={this.state.startTime}
                                        />
                                        {this.isFieldInError('endTime') && <Text style={{ color: 'red' }}>{this.getErrorsInField('endTime')[0]}</Text>}
                                        <DatePickerComponent
                                            style={{ width: 250, marginBottom: 20 }}
                                            placeholder="End Time"
                                            mode="datetime"
                                            minDate={this.state.startTime || new Date()}
                                            maxDate={new Date(Date.now() + 500 * 365 * 24 * 60 * 60 * 1000)}
                                            onDateChange={endTime => {
                                                this.updateState({ endTime });
                                            }}
                                            date={this.state.endTime}
                                        />
                                    </View>
                                }
                            </View>
                            <Button style={{ width: undefined, marginBottom: 20 }} block primary onPress={() => this.updateEvent()}>
                                <Text>Save</Text>
                            </Button>
                            <Button style={{ width: undefined, marginBottom: 40 }} block danger onPress={() => this.askDeleteEvent()}>
                                <Text>delete</Text>
                            </Button>
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
        event: state.event.event,
        emptyEvent: state.event.emptyEvent,
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchEvent, putEvent, fetchEvents, endPoll
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EditEventScreen);