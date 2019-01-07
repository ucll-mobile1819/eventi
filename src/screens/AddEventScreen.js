import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import PollTableComponent from '../components/PollTableComponent';
import { Container, Content, Button, Text, Form, Item, Input, Label, Textarea, Picker, Icon, H3 } from 'native-base';
import ToggleSwitch from 'toggle-switch-react-native';
import { View } from 'react-native';
import ValidationComponent from '../components/ValidationComponent';
import DatePickerComponent from '../components/DatePickerComponent';
import { fetchGroups } from '../actions/GroupActions';
import { fetchEvents } from '../actions/EventActions';
import { fetchFailure } from '../actions';
import { postEvent, postEventWithPoll } from '../network/event'

class AddEventScreen extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = this.getClearedState();
    }

    getClearedState() {
        return {
            pollDates: [],
            pollDateVotes: [], //unused but necessary
            groups: [],
            selectedGroupId: undefined,
            type: 'event',
            name: '',
            locationName: '',
            address: '',
            description: '',
            startTime: null,
            endTime: null,
            showActivityIndicator: true
        }
    }

    onLoad() {
        this.props.fetchGroups()
            .then(() => this.updateState({ groups: [...this.props.groups],  showActivityIndicator: false}))
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    newPollDateAdded(newPollDate) {
        // New poll dates don't have ids. But for removing them, we need to be able to identify them
        // So we add negative ids for new items and make sure to remove these ids before doing a POST/PUT to the api
        let id = Math.min(...this.state.pollDates.map(el => el.id)) - 1;
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

    changeType(typeBool) {
        if (typeBool) {
            this.updateState({
                type: 'poll'
            });
        }
        else {
            this.updateState({
                type: 'event'
            });
        }
    }

    onGroupChange(groupId) {
        if (groupId !== null && groupId !== undefined && groupId !== "placeholder") {
            this.updateState({
                selectedGroupId: Number(groupId)
            });
        } else {
            this.updateState({
                selectedGroupId: undefined
            });
        }
    }

    async submit() {
        if (!this.validateForm()) return;
        if (this.state.type === "event") {
            let response = await postEvent(
                this.state.selectedGroupId,
                this.state.name,
                this.state.description,
                this.state.startTime,
                this.state.endTime,
                this.state.locationName,
                this.state.address,
                null, null, null, null, true
            );
            await this.props.fetchEvents();
            if (response !== false) {
                this.props.navigation.navigate("Home");
            }
        }

        if (this.state.type === "poll") {

            let response = await postEventWithPoll(
                this.state.selectedGroupId,
                this.state.name,
                this.state.description,
                this.state.locationName,
                this.state.address,
                null, null, null, null,
                this.state.pollDates.map(el => ({ id: el.id < 0 ? undefined : el.id, startTime: el.startTime, endTime: el.endTime, votes: el.votes })),
                true
            );
            await this.props.fetchEvents();
            if (response !== false) {
                this.props.navigation.navigate("Home");
            }
        }
    }

    validateForm() {
        if (!this.validate({
            name: { name: 'Name', required: true, minlength: 2, maxlength: 50 },
            selectedGroupId: { name: 'Group', required: true }

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

    render() {
        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} showActivityIndicator={() => this.state.showActivityIndicator} navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)} >
                <Container>
                    <Content padder>
                        <Form style={{ marginLeft: 15, marginRight: 15 }}>
                            {this.isFieldInError('name') && <Text style={{ color: 'red', marginLeft: 15 }}>{this.getErrorsInField('name')[0]}</Text>}
                            <Item floatingLabel style={{ marginLeft: 0 }}>
                                <Label>Name</Label>
                                <Input onChangeText={name => this.updateState({ name })} />
                            </Item>

                            <Item floatingLabel style={{ marginLeft: 0 }}>
                                <Label>Location Name</Label>
                                <Input onChangeText={locationName => this.updateState({ locationName })} />
                            </Item>

                            <Item floatingLabel style={{ marginLeft: 0 }}>
                                <Label>Address</Label>
                                <Input onChangeText={address => this.updateState({ address })} />
                            </Item>

                            {this.isFieldInError('selectedGroupId') && <Text style={{ color: 'red', marginLeft: 15, marginTop: 20 }}>{this.getErrorsInField('selectedGroupId')[0]}</Text>}
                            <Item picker style={{ marginTop: 20 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    placeholder="Choose a group"
                                    placeholderIconColor="#007aff"
                                    style={{ width: undefined }}
                                    selectedValue={String(this.state.selectedGroupId)}
                                    onValueChange={this.onGroupChange.bind(this)}
                                >

                                    <Picker.Item label="Choose a group" value="placeholder" key="placeholder" />
                                    {this.state.groups.map((group) => {
                                        return <Picker.Item label={group.name} value={String(group.id)} key={String(group.id)} />
                                    })}
                                </Picker>
                            </Item>

                            <Textarea
                                rowSpan={5}
                                bordered
                                placeholder="Description"
                                style={{ width: undefined, marginTop: 20 }}
                                onChangeText={description => this.updateState({ description })} />

                            <View style={{ flex: 1, flexDirection: 'row', paddingTop: 20 }}>
                                <Text style={{ marginRight: 30 }}>Event</Text>
                                <ToggleSwitch
                                    isOn={this.state.type === 'poll'}
                                    onColor='#3F51b5'
                                    offColor='#3F51b5'
                                    size='medium'
                                    onToggle={(type) => this.changeType(type)}
                                />
                                <Text style={{ marginLeft: 30 }}>Poll</Text>
                            </View>

                            <View style={{ paddingTop: 20 }}>
                                {this.state.type === 'poll' &&
                                    <View style={{ marginBottom: 20 }}>
                                        <H3 style={{ marginBottom: 20 }}>Poll</H3>

                                        <PollTableComponent
                                            mode='configure'
                                            pollDates={this.state.pollDates}
                                            pollDateVotes={this.state.pollDateVotes}
                                            showAmountOfVotes={false}
                                            newPollDateAdded={this.newPollDateAdded.bind(this)}
                                            pollDateRemoved={this.pollDateRemoved.bind(this)}
                                            selectable={false}
                                        />
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

                            <Button style={{ width: undefined, marginBottom: 40 }} block primary onPress={() => this.submit()}>
                                <Text>Submit</Text>
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
        groups: state.group.groups
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchGroups, fetchEvents
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(AddEventScreen);