import React from 'react';
import { Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import PollTableComponent from '../components/PollTableComponent';

// pd === pollDate

class AddEventScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pollDates: [ // hardcoded, to be loaded in with redux
                { id: 1, startTime: new Date(2019, 0, 20, 12, 30, 0), endTime: new Date(2019, 0, 20, 15, 30, 0), votes: 3 },
                { id: 3, startTime: new Date(2019, 0, 20, 18, 0, 0), endTime: new Date(2019, 0, 20, 21, 0, 0), votes: 1 },
                { id: 2, startTime: new Date(2019, 0, 20, 14, 30, 0), endTime: new Date(2019, 0, 20, 17, 30, 0), votes: 0 },
            ],
            pollDateVotes: [ 1, 3 ], // hardcoded, to be loaded in with redux
            selectedPollDateId: null, // id of pd which is selected, needed for ending poll & choosing pd
            // (when saving form and changes are made AND poll is ended: first do one, then the other (end poll / PUT event), not at the same time)
            pollDateFixed: false, // if true, user can not deselect chosen pd or select another
        };
    }

    updateVotes(votes) {
        // hardcoded

        let pollDates = this.state.pollDates.map(el => {
            if (this.state.pollDateVotes.includes(el.id) && !votes.includes(el.id)) el.votes--; // Removing vote if pd is in old pdVotes list but removed from new one
            if (!this.state.pollDateVotes.includes(el.id) && votes.includes(el.id)) el.votes++; // Adding vote if pd is in new pdVotes list and not in old one
            return el;
        });
        this.setState({
            pollDateVotes: votes, // updating votes array, needed for POST/PUT api when form is saved
            pollDates, // updating so PollTableComponent updates the amount of votes / pd
        });
    }

    newPollDateAdded(newPollDate) {
        // New poll dates don't have ids. But for removing them, we need to be able to identify them
        // So we add negative ids for new items and make sure to remove these ids before doing a POST/PUT to the api
        let id = Math.min(...this.state.pollDates.map(el => el.id)) - 1;
        newPollDate.id = id;
        this.setState({
            pollDates: [ ...this.state.pollDates, newPollDate ],
        });
    }

    pollDateRemoved(id) {
        this.setState({
            pollDates: this.state.pollDates.filter(el => el.id !== id),
        });
    }

    pollDateSelected(selectedPollDateId) {
        this.setState({ selectedPollDateId });
    }

    render() {
        return (
            <AuthenticatedComponent navigate={this.props.navigation.navigate}>
                <Text>AddEventScreen</Text>
                <View style={{ margin: 20 }}>
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
                    onPress={() => this.setState({ pollDateFixed: !this.state.pollDateFixed })}
                    title={this.state.pollDateFixed ? "Deselect final time" : "Pick final time"}
                    />
                </View>
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