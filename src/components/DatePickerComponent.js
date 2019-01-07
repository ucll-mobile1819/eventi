import React, { Component } from 'react';
import DatePicker from 'react-native-datepicker';
import MountCheckingComponent from './MountCheckingComponent';

const months = [ "jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
const weekdays = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ];

/*
PROPS (optional):
    placeholder: String
    minDate: Date
    maxDate: Date
    showIcon: boolean
    onDateChange: Function, i.e.: (date) => {}
    style: Object
    customStyles: Object
    date: Date
    mode: String 'time', 'date' or 'datetime'

    format: Function, i.e.: (date) => { ... return 'xxx'; } returns to be displayed date as string
    (defaut format: "Mon 7 jan 08:30")
*/
export default class DatePickerComponent extends Component {
    constructor(props) {
        super(props);
        this.tmpDate = null;
    }

    datePickerConvertDate() {
        return this.tmpDate;
    }

    formatDateForDatePicker(d) {
        this.tmpDate = d;
        if (!(d instanceof Date)) return null;
        if (this.props.format instanceof Function) return this.props.format(d);
        let dbl = num => num.toString().length === 1 ? '0' + num.toString() : num.toString();
        let weekday = date => weekdays[(date.getDay()||7)-1];
        return `${weekday(d)} ${d.getDate()} ${months[d.getMonth()]} ${dbl(d.getHours())}:${dbl(d.getMinutes())}`;
    }

    onDatePickerChange() {
        if (this.props.onDateChange instanceof Function) this.props.onDateChange(this.tmpDate);
    }

    render() {
        return (
            <DatePicker
                style={this.props.style || {}}
                placeholder={this.props.placeholder || ""}
                getDateStr={date => this.formatDateForDatePicker(date)}
                minDate={this.props.minDate || new Date(1500, 0, 0)}
                maxDate={this.props.maxDate || new Date(Date.now() + 500*365*24*60*60*1000)}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={this.props.showIcon === undefined ? true : this.props.showIcon}
                onDateChange={() => this.onDatePickerChange()}
                customStyles={this.props.customStyles || {}}
                date={this.props.date || null}
                mode={this.props.mode || 'datetime'}
            />
        );
    }
}