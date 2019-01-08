import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-datepicker';
import MountCheckingComponent from './MountCheckingComponent';
import DatePickerComponent from './DatePickerComponent';

const months = [ "jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
const weekdays = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ];

const red = '#DD1111';
const green = '#11DD52';
const grey = '#a8aeb7';

/*
PROPS:
    mode: string (required)
    pollDateVotes: array (required)
    pollDates: array
    votesUpdated: function, i.e.: (newVotes) => { ... }
    showAmountOfVotes: boolean, only works in configure mode, needs to be true for EditEventScreen ! ! !
    selectable: boolean, allows user to select a polldate
    fixed: function which returns boolean, i.e.: () => { ... return true||false; }
    newPollDateAdded: function, i.e.: (newPollDate) => { ... }
    pollDateRemoved: function, i.e.: (pollDateId) => { ... }
    pollDateSelected: function, i.e.: (id) => { ... } (id can be null for deselecting)
    defaultBackgroundColor: boolean, default false (aka gray)
*/

export default class PollTableComponent extends Component {
    constructor(props) {
        super(props);
        if (this.props.mode !== 'overview' && this.props.mode !== 'configure')
            throw new Error('PollTableComponent requires the property mode to have the value "overview" or "configure".');
        if (this.props.mode === 'overview' && !(this.props.pollDates instanceof Array))
            throw new Error('PollTableComponent requires the property pollDates in overview mode to have the value of an array.');

        let pollDateVotes;
        if (!(this.props.pollDateVotes instanceof Array)) {
            throw new Error('PollTableComponent requires the property pollDateVotes (array of ids or array of polldate objects with an id).');
        } else if (this.props.pollDateVotes.every(el => typeof el == 'number')) {
            pollDateVotes = this.props.pollDateVotes;
        } else if (this.props.pollDateVotes.every(el => el instanceof Object)) {
            pollDateVotes = this.props.pollDateVotes.map(el => el.id !== undefined ? el.id : undefined).filter(el => el !== undefined);
        } else {
            throw new Error('PollTableComponent requires the property pollDateVotes (array of ids or array of polldate objects with an id).');
        }

        let tableHead;
        let tableData;
        if (this.props.mode === 'overview') {
            tableHead = [
                'Start',
                'End',
                <FontAwesomeIcon name="check" size={25} color={green} style={{ alignSelf: 'center' }} />,
                ''
            ];
            tableData = [

            ];
        } else {
            tableHead = this.props.showAmountOfVotes ?
                [ 'Start', 'End', <FontAwesomeIcon name="check" size={25} color={green} style={{ alignSelf: 'center' }} />, '' ] :
                [ 'Start', 'End', '' ];
            tableData = [];
        }
        this.tmpDatePickerDates = { startTime: null, endTime: null };
        this.state = {
            tableHead,
            tableData,
            newPollDate: null,
            lastInterval: 0,
            selectedPollDateId: null,
        };
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    getPollDates() {
        return this.props.pollDates || [];
    }

    formatDate(d) {
        if (!(d instanceof Date)) return null;
        let dbl = num => num.toString().length === 1 ? '0' + num.toString() : num.toString();
        let weekday = date => weekdays[(date.getDay()||7)-1];
        return `${weekday(d)} ${d.getDate()} ${months[d.getMonth()]} ${dbl(d.getHours())}:${dbl(d.getMinutes())}`;
    }

    sortPollDates(pollDates) {
        return pollDates.sort((a, b) => (a.startTime.getTime() - b.startTime.getTime()) || a.id - b.id);
    }

    voteOnPollDate(id, available) {
        if (!(this.props.votesUpdated instanceof Function)) return;
        let votes = [...this.props.pollDateVotes];
        if (available && !votes.includes(id)) votes.push(id);
        if (!available && votes.includes(id)) votes.splice(votes.indexOf(id), 1);
        this.props.votesUpdated(votes);
    }

    addNewPollDate() {
        this.updateState({
            newPollDate: {
                startTime: null,
                endTime: null,
            },
        });
    }

    isNewPollDateValid() {
        let item = this.state.newPollDate;
        return item.startTime instanceof Date && 
            item.endTime instanceof Date &&
            item.endTime.getTime() - item.startTime.getTime() > 0;
    }

    saveNewPollDate() {
        if (!this.isNewPollDateValid()) return;
        if (this.props.newPollDateAdded instanceof Function) this.props.newPollDateAdded(this.state.newPollDate);
        this.updateState({
            lastInterval: this.state.newPollDate.endTime.getTime() - this.state.newPollDate.startTime.getTime(),
            newPollDate: null,
        });
    }

    removePollDate(id) {
        if (this.props.fixed instanceof Function && this.props.fixed()) return;
        if (this.props.pollDateRemoved instanceof Function) this.props.pollDateRemoved(id);
        if (id === this.state.selectedPollDateId) {
            this.updateState({
                selectedPollDateId: null
            });
            if (this.props.pollDateSelected instanceof Function) this.props.pollDateSelected(null);
        }
    }

    guessEndTime(startTime) {
        if (this.state.lastInterval !== 0) {
            let endTime = new Date(startTime.getTime() + this.state.lastInterval);
            this.updateState({
                newPollDate: {
                    startTime: this.state.newPollDate.startTime,
                    endTime
                }
            });
        }
    }

    selectPollDate(id) {
        if (!this.props.selectable || (this.props.fixed instanceof Function && this.props.fixed())) return;
        if (this.state.selectedPollDateId === id) id = null;
        this.updateState({
            selectedPollDateId: id
        });
        if (this.props.pollDateSelected instanceof Function) this.props.pollDateSelected(id);
    }

    render() {
        let { mode, showAmountOfVotes } = this.props;
        return (
            <MountCheckingComponent setMounted={val => { this._ismounted = val; }}>
                <View style={this.props.defaultBackgroundColor ? {} : styles.container}>
                    <Table borderStyle={styles.border}>
                        <Row data={this.state.tableHead} flexArr={mode == 'overview' ? [3, 3, 1, 2] : showAmountOfVotes ? [7, 7, 2, 2] : [4, 4, 1] } style={styles.head} textStyle={styles.textHeader}/>
                        {mode === 'overview' ? this.renderRowsOverview() : this.renderRowsConfigure()}
                    </Table>
                    {mode === 'configure' ? this.renderPlusButton() : <></>}
                </View>
            </MountCheckingComponent>
        );
    }

    renderRowsOverview() {
        let pollDates = this.getPollDates();
        let pollDateVotes = this.props.pollDateVotes;
        return (
            <>
                {this.sortPollDates(pollDates).map((item, index) => 
                    <TableWrapper key={index} flexArr={[3, 3, 1, 2]} style={styles.row} borderStyle={styles.border}>
                        <Cell key={0} flex={3} data={this.formatDate(item.startTime)} textStyle={styles.date}/>
                        <Cell key={1} flex={3} data={this.formatDate(item.endTime)} textStyle={styles.date}/>
                        <Cell key={2} flex={1} data={item.votes} textStyle={styles.votes}/>
                        <Cell key={3} flex={2} data={
                            <View style={styles.buttonContainer}>
                                <View style={styles.buttons}>
                                    <TouchableWithoutFeedback onPress={() => this.voteOnPollDate(item.id, true)}>
                                        <FontAwesomeIcon name="check" size={25} color={pollDateVotes.includes(item.id) ? green : grey}/>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={styles.buttons}>
                                    <TouchableWithoutFeedback onPress={() => this.voteOnPollDate(item.id, false)}>
                                        <FontAwesomeIcon name="close" size={25} color={pollDateVotes.includes(item.id) ? grey : red}/>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        }/>
                    </TableWrapper>
                )}
            </>
        );
    }

    renderRowsConfigure() {
        let pollDates = this.getPollDates();
        let { newPollDate, selectedPollDateId } = this.state;
        let { pollDateVotes, showAmountOfVotes, fixed } = this.props;
        return (
            <>
                {this.sortPollDates(pollDates).map((item, index) => 
                    <TableWrapper
                    key={index}
                    flexArr={showAmountOfVotes ? [7, 7, 2, 2] : [4, 4, 1]}
                    style={item.id !== selectedPollDateId ? styles.row : fixed instanceof Function && fixed() ? styles.rowFixed : styles.rowSelected}
                    borderStyle={styles.border}
                    >
                        <TouchableWithoutFeedback onPress={() => this.selectPollDate(item.id)}>
                            <Cell key={0} flex={showAmountOfVotes ? 7 : 4} data={this.formatDate(item.startTime)} textStyle={styles.date}/>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.selectPollDate(item.id)}>
                            <Cell key={1} flex={showAmountOfVotes ? 7 : 4} data={this.formatDate(item.endTime)} textStyle={styles.date}/>
                        </TouchableWithoutFeedback>
                        {showAmountOfVotes ?
                            <TouchableWithoutFeedback onPress={() => this.selectPollDate(item.id)}>
                                <Cell key={2} flex={2} data={item.votes} textStyle={styles.votes}/>
                            </TouchableWithoutFeedback> : 
                            <></>
                        }
                        <TouchableWithoutFeedback onPress={() => this.selectPollDate(item.id)}>
                        <Cell key={showAmountOfVotes ? 3 : 2} flex={showAmountOfVotes ? 2 : 1} data={
                            <View style={styles.buttonContainer}>
                                <TouchableWithoutFeedback onPress={() => this.removePollDate(item.id)}>
                                    <MaterialIcon name="delete" size={25} color={grey}/>
                                </TouchableWithoutFeedback>
                            </View>
                        }/>
                        </TouchableWithoutFeedback>
                    </TableWrapper>
                )}
                {newPollDate != null &&
                    <TableWrapper key={pollDates.length} flexArr={showAmountOfVotes ? [7, 7, 2, 2] : [4, 4, 1]} style={styles.row} borderStyle={styles.border}>
                        <Cell key={0} flex={showAmountOfVotes ? 7 : 4} data={
                            <DatePickerComponent
                                placeholder="Enter start time"
                                minDate={new Date()}
                                showIcon={false}
                                onDateChange={startTime => { this.updateState({ newPollDate: { ...newPollDate, startTime } }); this.guessEndTime(startTime); }}
                                customStyles={{ dateInput: { borderWidth: 0, alignItems: 'flex-start', paddingLeft: 6 }}}
                                date={newPollDate.startTime}
                            />
                        }/>
                        <Cell key={1} flex={showAmountOfVotes ? 7 : 4} data={
                            <DatePickerComponent
                                placeholder="Enter end time"
                                minDate={new Date()}
                                showIcon={false}
                                onDateChange={endTime => this.updateState({ newPollDate: { ...newPollDate, endTime } })}
                                customStyles={{ dateInput: { borderWidth: 0, alignItems: 'flex-start', paddingLeft: 6 }}}
                                date={newPollDate.endTime}
                            />
                        }/>
                        {showAmountOfVotes ? <Cell key={2} flex={2} data={''}/> : <></>}
                        <Cell key={showAmountOfVotes ? 3 : 2} flex={showAmountOfVotes ? 2 : 1} data={
                            <View style={styles.buttonContainer}>
                                <TouchableWithoutFeedback onPress={() => this.saveNewPollDate()}>
                                    <FontAwesomeIcon name="check" size={25} color={this.isNewPollDateValid() ? green : grey}/>
                                </TouchableWithoutFeedback>
                            </View>
                        }/>
                    </TableWrapper>
                }
            </>
        );
    }

    renderPlusButton() {
        return (
            <TouchableWithoutFeedback onPress={() => this.addNewPollDate()}>
                <View style={styles.addButton}>
                    <Text>+</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E9E9EF',
    },
    head: {
        height: 40,
        backgroundColor: '#002984',
    },
    date: {
        margin: 6,
    },
    votes: {
        alignSelf: 'center',
    },
    buttons: {
        alignContent: 'center',
        margin: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    row: {
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    rowSelected: {
        flexDirection: 'row',
        backgroundColor: '#CDD0FB',
    },
    rowFixed: {
        flexDirection: 'row',
        backgroundColor: '#9FF69A',
    },
    text: {
        marginLeft: 6,
    },
    textHeader: {
        marginLeft: 6,
        color: 'white',
    },
    border: {
        borderWidth: 1,
        borderColor: '#021957'
    },
    addButton: {
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#021957',
        width: 30,
        height: 30,
        backgroundColor: 'white',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});