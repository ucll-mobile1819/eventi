import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const red = '#DD1111';
const green = '#11DD52';
const grey = '#a8aeb7';

// <FontAwesomeIcon name="check" size={15} color={status == 'Going'? green : grey}/>
// <FontAwesomeIcon name="close" size={15} color={status == 'Going'? green : grey}/>

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
                <FontAwesomeIcon name="check" size={20} color={green} style={{ alignSelf: 'center' }} />,
                ''
            ];
            tableData = [

            ];
        } else {
            tableHead = [ 'Start', 'End', '' ];
            tableData = [];
        }
        this.state = {
            tableHead,
            tableData,
            pollDates: this.props.pollDates || [],
            newPollDate: null,
            pollDateVotes,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.tableHead} flexArr={[3, 3, 1, 2]} style={styles.head} textStyle={styles.text}/>
                    {this.props.mode === 'overview' ? this.renderRowsOverview() : this.renderRowsConfigure()}
                </Table>
            </View>
        );
    }

    formatDate(d) {
        if (!(d instanceof Date)) return null;
        let dbl = num => num.toString().length === 1 ? '0' + num.toString() : num.toString();
        return `${dbl(d.getDate())}-${dbl(d.getMonth()+1)}-${d.getFullYear()} ${dbl(d.getHours())}:${dbl(d.getMinutes())}`;
    }

    renderRowsOverview() {
        const { pollDates, newPollDate, pollDateVotes } = this.state;
        return (
            <>
                {pollDates.map((item, index) => 
                    <TableWrapper key={index} flexArr={[3, 3, 1, 2]} style={styles.row}>
                        <Cell key={0} flex={3} data={this.formatDate(item.startTime)} textStyle={styles.date}/>
                        <Cell key={1} flex={3} data={this.formatDate(item.startTime)} textStyle={styles.date}/>
                        <Cell key={2} flex={1} data={item.votes} textStyle={styles.votes}/>
                        <Cell key={3} flex={2} data={
                            <View>
                                <FontAwesomeIcon name="check" size={20} color={pollDateVotes.includes(item.id) ? green : grey}/>
                                <FontAwesomeIcon name="close" size={20} color={pollDateVotes.includes(item.id) ? grey : red}/>
                            </View>
                        } textStyle={styles.buttons}/>
                    </TableWrapper>
                )}
                {newPollDate !== null &&
                    <TableWrapper key={pollDates.length} style={styles.row}>
                        <Cell key={0} data={"Test1"} />
                        <Cell key={1} data={"Test2"} />
                        <Cell key={2} data={"Test3"} />
                        <Cell key={3} data={"Test4"} />
                    </TableWrapper>
                }
            </>
        );
    }

    renderRowsConfigure() {
        return (
            <>

            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E9E9EF',
    },
    head: {
        height: 40,
        backgroundColor: '#f1f8ff',
    },
    date: {
        margin: 6,
    },
    votes: {
        alignSelf: 'center',
    },
    buttons: {
        alignSelf: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#FFF1C1'
    },
});