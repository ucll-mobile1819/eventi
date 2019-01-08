import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import { fetchEvent, putEvent } from '../actions/EventActions';
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

    async putEvent() {
        if (!this.validateForm()) return;

        let pollDatesToPut = this.state.pollDates.map(el => {
            let newEl = { startTime: el.startTime, endTime: el.endTime };
            if (el.id >= 0) {
                newEl.id = el.id;
                newEl.votes = el.votes;
            }
            return newEl;
        });
        console.log(pollDatesToPut);

        this.updateState({ showActivityIndicator: true });
        this.props.putEvent(
            this.state.id,
            this.state.name,
            this.state.description,
            this.state.startTime,
            this.state.endTime,
            this.state.locationName,
            this.state.address,
            this.state.city,
            this.state.zipcode,
            this.state.country,
            pollDatesToPut)
            .then(() => {
                //RELOAD STATE

                this.props.fetchEvent(this.props.navigation.state.params.id)
                    .then(() => {
                        this.updateState({ ...this.props.event })
                        this.props.navigation.push('Event', { id: this.props.navigation.state.params.id })
                    })
            })
    }

    async deleteEvent() {
        let response = await deleteEvent(
            this.state.id,
            true
        );

        if (response !== false) {
            Alert.alert('Event deleted', 'The event was successfully deleted.');
            this.updateState(this.getClearedState());
            await this.props.fetchEvents();
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
        if (id > 0) {
            id = -1
        }
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
                                            selectable={true}
                                            fixed={() => this.state.pollDateFixed}
                                        />

                                        <Button style={{ width: undefined, marginTop: 15 }} block primary onPress={() => this.setState({ pollDateFixed: !this.state.pollDateFixed })}>
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
                            <Button style={{ width: undefined, marginBottom: 20 }} block primary onPress={() => this.putEvent()}>
                                <Text>Update</Text>
                            </Button>
                            <Button style={{ width: undefined, marginBottom: 40 }} block danger onPress={() => this.deleteEvent()}>
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
        fetchEvent, putEvent
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EditEventScreen);