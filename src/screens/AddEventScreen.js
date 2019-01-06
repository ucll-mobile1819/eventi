import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import PollTableComponent from '../components/PollTableComponent';
import { Container, Content, Button, Text, Form, Item, Input, Label, Textarea, Picker, Icon } from 'native-base';
import ToggleSwitch from 'toggle-switch-react-native';
import { View } from 'react-native';
import ValidationComponent from '../components/ValidationComponent';

// pd === pollDate

class AddEventScreen extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            pollDates: [ // hardcoded, to be loaded in with redux
                { id: 1, startTime: new Date(2019, 0, 20, 12, 30, 0), endTime: new Date(2019, 0, 20, 15, 30, 0), votes: 3 },
                { id: 3, startTime: new Date(2019, 0, 20, 18, 0, 0), endTime: new Date(2019, 0, 20, 21, 0, 0), votes: 1 },
                { id: 2, startTime: new Date(2019, 0, 20, 14, 30, 0), endTime: new Date(2019, 0, 20, 17, 30, 0), votes: 0 },
            ],
            pollDateVotes: [1, 3], // hardcoded, to be loaded in with redux
            selectedPollDateId: null, // id of pd which is selected, needed for ending poll & choosing pd
            // (when saving form and changes are made AND poll is ended: first do one, then the other (end poll / PUT event), not at the same time)
            pollDateFixed: false, // if true, user can not deselect chosen pd or select another
            type: 'event',
        };
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

    render() {
        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} navigate={this.props.navigation.navigate}>
                <Container>
                    <Content padder>
                        <Form>
                            <Item floatingLabel>
                                <Label>Name</Label>
                                <Input />
                            </Item>

                            <Item floatingLabel>
                                <Label>Location Name</Label>
                                <Input />
                            </Item>

                            <Item floatingLabel>
                                <Label>Address</Label>
                                <Input />
                            </Item>

                            <Item picker style={{ marginLeft: 15 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    placeholder="Group"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    style={{ width: undefined }}
                                //selectedValue={this.state.selected}
                                //onValueChange={this.onValueChange.bind(this)}
                                >
                                    <Picker.Item label="Group1" value="key0" />
                                    <Picker.Item label="Group2" value="key1" />
                                    <Picker.Item label="Group3" value="key2" />
                                </Picker>
                            </Item>

                            <Textarea rowSpan={5} bordered placeholder="Description" style={{ width: undefined, marginLeft: 15 }} />

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

                            <View style={{ paddingTop: 20, marginLeft: 15}}>
                                {this.state.type === 'poll' &&
                                    <Text>PollDateComponent enz hier </Text>
                                }

                                {this.state.type === 'event' &&
                                    <Text>Start time & end time date pickers hier</Text>
                                }
                            </View>

                            <Button style={{ margin: 15, width: undefined }} block primary >
                                <Text>Submit</Text>
                            </Button>
                        </Form>


                    </Content>
                </Container>
                {/* <View style={{ margin: 20 }}>
                    <PollTableComponent
                        // See top of file PollTableComponent.js for prop information
                        mode='configure'
                        pollDates={this.state.pollDates}
                        pollDateVotes={this.state.pollDateVotes}
                        votesUpdated={this.updateVotes.bind(this)}
                        showAmountOfVotes={true}
                        newPollDateAdded={this.newPollDateAdded.bind(this)}
                        pollDateRemoved={this.pollDateRemoved.bind(this)}
                        selectable={true}
                        fixed={() => this.state.pollDateFixed}
                    />
                </View>
                <View style={{ margin: 20 }}>
                    <Button
                    onPress={() => this.updateState({ pollDateFixed: !this.state.pollDateFixed })}
                    title={this.state.pollDateFixed ? "Deselect final time" : "Pick final time"}
                    />
                </View> */}
            </AuthenticatedComponent>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(AddEventScreen);