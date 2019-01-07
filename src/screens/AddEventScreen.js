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
import loginregisterStyles from '../styles/loginregister';

class AddEventScreen extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
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
            endTime: null
        };
    }

    onLoad() {
        this.props.fetchGroups()
            .then(() => this.updateState({ groups: [...this.props.groups] }))
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    updateVotes(votes) {
        // hardcoded

        let pollDates = this.state.pollDates.map(el => {
            if (this.state.pollDateVotes.includes(el.id) && !votes.includes(el.id)) el.votes--; // Removing vote if pd is in old pdVotes list but removed from new one
            if (!this.state.pollDateVotes.includes(el.id) && votes.includes(el.id)) el.votes++; // Adding vote if pd is in new pdVotes list and not in old one
            return el;
        });
        this.updateState({
            pollDateVotes: votes, // updating votes array, needed for POST/PUT api when form is saved
            pollDates, // updating so PollTableComponent updates the amount of votes / pd
        });
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

    pollDateSelected(selectedPollDateId) {
        this.updateState({ selectedPollDateId });
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
        if (groupId !== null || groupId !== undefined || groupId !== "placeholder ") {
            this.updateState({
                selectedGroupId: parseInt(groupId)
            });
        }
    }

    submit() {
        this.validateForm();
        console.log(this.state)
    }

    validateForm() {
        if (!this.validate({
            name: { name: 'Name', required: true, minlength: 2, maxlength: 50 },

        })) {
            return false;
        }


    }

    render() {
        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)} >
                <Container>
                    <Content padder>
                        <Form>
                        {this.isFieldInError('name') && <Text style={{color: 'red', marginLeft: 15}}>{this.getErrorsInField('name')[0]}</Text>}
                            <Item floatingLabel>
                                <Label>Name</Label>
                                <Input onChangeText={name => this.updateState({ name })} />
                            </Item>

                            <Item floatingLabel>
                                <Label>Location Name</Label>
                                <Input onChangeText={locationName => this.updateState({ locationName })} />
                            </Item>

                            <Item floatingLabel>
                                <Label>Address</Label>
                                <Input onChangeText={address => this.updateState({ address })} />
                            </Item>

                            <Item picker style={{ marginLeft: 15 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    placeholder="Choose a group"
                                    placeholderStyle={{ color: "#bfc6ea" }}
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
                                style={{ width: undefined, marginLeft: 15 }}
                                onChangeText={description => this.updateState({ description })} />

                            <View style={{ flex: 1, flexDirection: 'row', marginLeft: 15, paddingTop: 20 }}>
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

                            <View style={{ paddingTop: 20, marginLeft: 15 }}>
                                {this.state.type === 'poll' &&
                                    <View style={{ marginBottom: 20 }}>
                                        <H3 style={{ marginBottom: 20 }}>Poll!</H3>

                                        <PollTableComponent
                                            mode='configure'
                                            pollDates={this.state.pollDates}
                                            pollDateVotes={this.state.pollDateVotes}
                                            votesUpdated={this.updateVotes.bind(this)}
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

                            <Button style={{ margin: 15, width: undefined, marginBottom: 40 }} block primary onPress={() => this.submit()}>
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
        fetchGroups
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(AddEventScreen);